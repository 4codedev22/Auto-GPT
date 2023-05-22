import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { MapsTimezoneDTO } from './dto/MapsTimezone.dto';

@Injectable()
export class GoogleMapsService {
  logger = new Logger('GoogleMapsService');

  private milisecondsToSeconds(mili: number): number {
    return Math.floor(mili / 1000);
  }

  async getTimezoneFromLatLon(lat: number, lon: number): Promise<MapsTimezoneDTO | undefined> {
    const url = process.env.GOOGLE_MAPS_TIMEZONE_URL?.replace('%LAT%', `${lat}`)
      .replace('%LONG%', `${lon}`)
      .replace('%TIMESTAMP%', `${this.milisecondsToSeconds(new Date().getTime())}`)
      .replace('%GOOGLE_API_KEY%', process.env.GOOGLE_API_KEY);

    this.logger.debug(url, 'Google Maps Timezone URL');
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      this.logger.debug(error);
    }
    return null;
  }



  async searchAddress(search: string, sessionToken: string): Promise<any | undefined> {
    const url = process.env.GOOGLE_MAPS_PLACE_AUTOCOMPLETE_URL?.replace('%SEARCH%', encodeURI(search))
      .replace('%GOOGLE_API_KEY%', process.env.GOOGLE_API_KEY)
      .replace('%SESSION_TOKEN%', encodeURI(sessionToken));
    this.logger.debug(url, 'Google Maps Place Autocomplete URL');
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      this.logger.debug(error);
    }
    return null;
  }
}
