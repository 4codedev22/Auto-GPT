import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import FirebaseAdmin from 'firebase-admin';

import { PushNotificationPermission } from '../domain/enumeration/push-notification-permission';

import { RpushAppDTO } from './dto/rpush-app.dto';
import { RpushNotificationDTO } from './dto/rpush-notification.dto';

import { RpushAppService } from './rpush-app.service';
import { RpushNotificationService } from './rpush-notification.service';

function filterUnique(value: string | null, index: number, self: string[]) {
  return value != null && self.indexOf(value) === index;
}

@Injectable()
export class PushNotificationService implements OnModuleInit{
  logger = new Logger('PushNotificationService');

  constructor(
    private rpushAppService: RpushAppService,
    private rpushNotificationService: RpushNotificationService,
  ) {
    
  }

  async onModuleInit() {
    await this.initializeFirebaseApps();
    this.logger.debug('PushNotificationService initialized');
  }

  getCredentialConfig(projectId: string) {
    const processedProjectId = projectId.toUpperCase().replace(/-/g, '_');
    const serviceAccountString = process.env[`FIREBASE_${processedProjectId}_SERVICE_ACC_JSON`];

    if (!serviceAccountString) throw new Error(`Firebase service account not found for project ${projectId}`);
    const serviceAccountJSON: FirebaseAdmin.ServiceAccount = JSON.parse(serviceAccountString);

    const credential = FirebaseAdmin.credential.cert(serviceAccountJSON);
    return { credential, projectId };
  }

  async initializeFirebaseApps() {
    if(FirebaseAdmin.apps.length > 0) return;
    const certificates = await this.rpushAppService.listCertificatesDistinct();
    if (certificates.length === 0) return;
    certificates.forEach(certificate => {
      try {
        FirebaseAdmin.initializeApp(this.getCredentialConfig(certificate), certificate);
      } catch (e) {
        this.logger.error(`Failed to initialize firebase app for ${certificate}`);
        this.logger.error(e);
      }
    });
  }

  createRpushApp(companyName: string) {
    const rpushAppObject = {
      name: `mobfleet-${companyName.toLowerCase()}`,
      connections: 1,
      type: 'Rpush::Client::ActiveRecord::Gcm::App',
      authKey: process.env.FIREBASE_AUTH_KEY,
      certificate: process.env.FIREBASE_PROJECT_ID,
    } as RpushAppDTO;

    return this.rpushAppService.save(rpushAppObject);
  }

  createRpushNotification(notification: any, deviceToken: string, rpushApp: RpushAppDTO, error?: string) {
    const now = new Date();

    const rpushNotificationObject = {
      delivered: error == null,
      failed: error != null,
      errorDescription: error,
      appId: rpushApp.id,
      processing: false,
      deliveredAt: error == null ? now : null,
      failedAt: error != null ? now : null,
      registrationIds: deviceToken,
      deviceToken,
      notification: JSON.stringify(notification),
    } as RpushNotificationDTO;

    return this.rpushNotificationService.save(rpushNotificationObject);
  }

  async sendPushNotification(companyName: string, deviceToken: string, title: string, body: string) {
    const rpushAppName = `mobfleet-${companyName.toLowerCase()}`;
    let rpushApp = await this.rpushAppService.findByFields({ where: { name: rpushAppName } });

    if (!rpushApp) rpushApp = await this.createRpushApp(companyName);

    const firebaseApp = FirebaseAdmin.apps[rpushApp.certificate];
    const notificationObject = { title, body };

    const result = await FirebaseAdmin.messaging(firebaseApp).sendToDevice(
      deviceToken,
      { notification: notificationObject },
    )
      .then(({ results }) => {
        const error = results[0]?.error;
        const processedError = error && `${error.code} - ${error.message}`;

        return { error: processedError };
      })
      .catch((error) => {
        this.logger.error(`[ERROR SENDING PUSH NOTIFICATION] [${JSON.stringify(error)}]`);
        return { error: JSON.stringify(error) };
      });

    this.createRpushNotification(notificationObject, deviceToken, rpushApp, result.error);
  }

  checkIfUserHasEnabled(typeValue: PushNotificationPermission, userConfig: number) {
    if (userConfig === 0) return true;

    return (userConfig & typeValue) != 0;
  }
}
