import { Component } from '@angular/core';
import { LinksService } from './links.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    providers: [LinksService]
})

export class AppComponent {
    testClicked = false;
    success     = [];
    skipped     = [];
    inValid     = [];
    linkData    : Links[];


    constructor(private linksService:LinksService) {
        this.linkData    = this.linksService.getData1();
    }

    onDataSelect(event) {
        if (event.target.value === 'Data 1') {
            this.linkData = this.linksService.getData1();
        } else {
            this.linkData = this.linksService.getData2();
        }

    }

    WebCrawl(webdata) {
        let url = webdata[0].address,
            pagesVisited = [],
            pagesToVisit = [],
            addresses    = [],
            inValid      = [],
            duplicates   = [],
            validPages   = [],
            me           = this;

        pagesToVisit.push(url);


        for (let addrs of webdata) {
            addresses.push(addrs.address);
        }

        crawl();

        function crawl() {

            if (pagesToVisit.length <= 0) {
                me.inValid = inValid;
                me.success = validPages;
                me.skipped = duplicates;
                return ;
            }
            let nextPage = pagesToVisit.pop();

            if (pagesVisited.includes(nextPage)) {
                if (!duplicates.includes(nextPage)) {
                    duplicates.push(nextPage);
                }
                crawl();
            } else {
                //visitPage(nextPage, crawl);
                let index = addresses.indexOf(nextPage);
                if (index >= 0) {
                    validPages.push(nextPage);
                    collectInternalLinks(index);
                } else {
                    inValid.push(nextPage);
                }
                crawl();

            }
        }

        //function visitPage(url, callback) {
        //
        //    pagesVisited.push(url);
        //
        //    let index = addresses.indexOf(url);
        //    if (index >= 0) {
        //        validPages.push(url);
        //        collectInternalLinks(index);
        //    } else {
        //        inValid.push(url);
        //    }
        //    callback();
        //}

        function collectInternalLinks(index) {
            let links = webdata[index].links;
            links.forEach(function (lnk) {
                pagesToVisit.push(lnk);
            });

        }
    }

    onStartCrawl() {
        this.testClicked = true;
        this.WebCrawl(this.linkData);
    }

}

interface Links {
    address : string;
    links   : string[];
}