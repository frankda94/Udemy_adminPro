import { Component, OnInit } from '@angular/core';
import { Router, ActivationEnd } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { Title, MetaDefinition, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styles: [
  ],
})
export class BreadcrumbsComponent implements OnInit {

  data: any;
  //Title ==> personalizar pestaña con titulo indicado
  //Meta ==> metaTags
  constructor(private router: Router, private title: Title, private meta: Meta) {
    this.getDataRoute().subscribe(dataResponse => {
      this.data = dataResponse
      this.title.setTitle(this.data.titulo);

      const metaTag: MetaDefinition = {
        name: 'description',
        content: this.data.titulo,
      };
      this.meta.updateTag(metaTag);
    });
  }

  ngOnInit(): void {
  }

  getDataRoute() {
    return this.router.events.pipe(
      filter(evento => evento instanceof ActivationEnd),
      filter((evento: ActivationEnd) => evento.snapshot.firstChild === null),
      map((evento: ActivationEnd) => evento.snapshot.data)
    );
  }

}
