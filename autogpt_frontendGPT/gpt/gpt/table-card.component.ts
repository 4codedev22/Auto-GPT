import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-table-card',
  templateUrl: './table-card.component.html',
  styleUrls: ['./table-card.component.scss']
})
export class TableCardComponent implements OnInit {
  @Input() data: any;
  @Input() columns: any;
  @Input() actions: any;
  @Input() showActions: boolean = true;
  @Input() showHeader: boolean = true;
  @Input() showFooter: boolean = true;
  @Input() showPagination: boolean = true;
  @Input() showSearch: boolean = true;
  @Input() showFilter: boolean = true;
  @Input() showSort: boolean = true;
  @Input() showExport: boolean = true;
  @Input() showImport: boolean = true;
  @Input() showRefresh: boolean = true;
  @Input() showSettings: boolean = true;
  @Input() showFullScreen: boolean = true;
  @Input() showColumnSelector: boolean = true;
  @Input() showAdd: boolean = true;
  @Input() showEdit: boolean = true;
  @Input() showDelete: boolean = true;
  @Input() showView: boolean = true;
  @Input() showDuplicate: boolean = true;
  @Input() showPrint: boolean = true;
  @Input() showEmail: boolean = true;
  @Input() showSMS: boolean = true;
  @Input() showWhatsApp: boolean = true;
  @Input() showTelegram: boolean = true;
  @Input() showFacebook: boolean = true;
  @Input() showTwitter: boolean = true;
  @Input() showLinkedIn: boolean = true;
  @Input() showInstagram: boolean = true;
  @Input() showYouTube: boolean = true;
  @Input() showPinterest: boolean = true;
  @Input() showSnapchat: boolean = true;
  @Input() showTikTok: boolean = true;
  @Input() showReddit: boolean = true;
  @Input() showDiscord: boolean = true;
  @Input() showTwitch: boolean = true;
  @Input() showGitHub: boolean = true;
  @Input() showGitLab: boolean = true;
  @Input() showBitbucket: boolean = true;
  @Input() showJira: boolean = true;
  @Input() showConfluence: boolean = true;
  @Input() showSlack: boolean = true;
  @Input() showZoom: boolean = true;
  @Input() showGoogleMeet: boolean = true;
  @Input() showMicrosoftTeams: boolean = true;
  @Input() showSkype: boolean = true;
  @Input() showWebex: boolean = true;
  @Input() showGoToMeeting: boolean = true;
  @Input() showZohoMeeting: boolean = true;
  @Input() showSalesforce: boolean = true;
  @Input() showHubSpot: boolean = true;
  @Input() showZendesk: boolean = true;
  @Input() showFreshdesk: boolean = true;
  @Input() showIntercom: boolean = true;
  @Input() showDrift: boolean = true;
  @Input() showCrisp: boolean = true;
  @Input() showLiveChat: boolean = true;
  @Input() showWhatsAppBusiness: boolean = true;
  constructor() {}
  ngOnInit() {}
}
