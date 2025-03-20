import { Component, HostListener, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FixedService } from '../../../core/utils/fixed.service';
import { GlobalService } from '../../../core/utils/global.service';
import { GeneratorService } from '../../generator.service';
import { CookieService } from 'ngx-cookie-service';
import { CookieEnum } from '../../../core/enums/cookie.enum';

@Component({
  selector: 'app-summarize-page',
  standalone: false,
  templateUrl: './summarize-page.component.html',
  styleUrl: './summarize-page.component.scss',
})
export class SummarizePageComponent implements OnInit {
  contentId: string;
  messageText: string;
  summary: any;
  chatMassage: any;
  showChatBody: boolean;
  isSmallScreen: boolean = window.innerWidth < 768;
  role: 'user' | 'model';

  constructor(
    public fixed: FixedService,
    public global: GlobalService,
    public generatorSer: GeneratorService,
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private cookieSer: CookieService
  ) {}

  @HostListener('window:resize', ['$event'])
  onResize() {
    console.log(window.innerWidth)
    this.isSmallScreen = window.innerWidth < 768;
    this.isSmallScreen ? this.showChatBody = false : this.showChatBody = true;
  }

  ngOnInit() {
    this.isSmallScreen ? this.showChatBody = false : this.showChatBody = true;
    console.log(this.isSmallScreen);
    console.log(this.showChatBody);

    this.activatedRoute.params.subscribe((params) => {
      if (params['id'] != null) {
        this.contentId = params['id'];
        this.getSummariez(params['id']);
        this.getSummariezChat(params['id']);
      }
    });
  }

  getSummariez(id: string) {
    this.generatorSer.getSummery(id).subscribe({
      next: (res) => {
        this.summary = res
          .replace(/## (.*?)\n\n/g, '<h2 class="title">$1</h2>')
          .replace(/\* \*\*(.*?)\*\*/g, '<div class="tagcloud"><a>$1</a></div>')
          .replace(/\*\*(.*?)\*\*\n\n/g, '<h6>$1</h6>')
          .replace(/\*\*(.*?)\*\*/g, '<h6>$1</h6>') // Convert **bold** to <b>bold</b>
          .replace(/\n/g, '<br>') // Convert new lines to <br> for HTML display
          // .replace(/\* (.*?)\n/g, '<li>$1</li>') // Convert * bullet points to <li>
          // Convert ## headings to <h2>
          .replace(/### (.*?)\n/g, '<h3>$1</h3>'); // Convert ### subheadings to <h3>;
      },
      error: (err) => {
        if (
          err.status == 401 &&
          err.error['error'] == 'Refresh token expired'
        ) {
          console.log(this.fixed.youtubeCookies);
          this.cookieSer.delete(CookieEnum.youtubeToken);
          this.fixed.youtubeCookies == null;
          console.log(this.fixed.youtubeCookies);
          this.router.navigateByUrl('/generator/home');
        }
      },
    });
  }

  getSummariezChat(id: string) {
    this.generatorSer.getSummeryChat(id).subscribe({
      next: (res) => {
        this.chatMassage = res.map((item) => ({
          role: item.role,
          text:
            item.role == 'user'
              ? item.parts[0].text
              : item.parts[0].text
                  .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
                  .replace(/\n/g, '<br>')
                  .replace(/\* (.*?)<br>/g, '<li>$1</li>')
                  .replace(/<br><li>/g, '<ul><li>')
                  .replace(/<\/li><br>/g, '</li></ul>')
                  .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>'),
        }));
      },
      error: (err) => {},
    });
  }

  sendMessage() {
    if (this.messageText.trim()) {
      this.generatorSer
        .sendSummeryChat(this.contentId, this.messageText)
        .subscribe({
          next: (res) => {
            this.chatMassage.push({ role: 'user', text: this.messageText });
            this.chatMassage.push({
              role: 'model',
              text: res.answer
                .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') // Convert **bold** to <b>bold</b>
                .replace(/\n/g, '<br>') // Convert new lines to <br>
                .replace(/\* (.*?)<br>/g, '<li>$1</li>') // Convert * bullet points to <li>
                .replace(/<br><li>/g, '<ul><li>') // Wrap lists in <ul>
                .replace(/<\/li><br>/g, '</li></ul>') // Close list when a new line appears
                .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>'), // Bold text
            });
            this.messageText = null;
          },
          error: (err) => {},
        });
    }
  }

  toggleChat() {
    if (this.isSmallScreen) {
      this.showChatBody = !this.showChatBody;
    }
  }
}
