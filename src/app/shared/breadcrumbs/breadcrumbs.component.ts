import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivationEnd } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { Title, MetaDefinition, Meta } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styles: [
  ],
})
export class BreadcrumbsComponent implements OnInit, OnDestroy {

  titulo: string;
  public tituloSubs$: Subscription;
  //Title ==> personalizar pestaña con titulo indicado
  //Meta ==> metaTags
  constructor(private router: Router, private meta: Meta) {
    this.tituloSubs$ = this.getDataRoute().subscribe(({ titulo }) => {
      this.titulo = titulo;

      const metaTag: MetaDefinition = {
        name: 'description',
        content: this.titulo,
      };
      this.meta.updateTag(metaTag);
    });
  }

  ngOnDestroy() {
    this.tituloSubs$.unsubscribe();
  }

  ngOnInit() {

  }

  getDataRoute() {
    return this.router.events.pipe(
      filter(evento => evento instanceof ActivationEnd),
      filter((evento: ActivationEnd) => evento.snapshot.firstChild === null),
      map((evento: ActivationEnd) => evento.snapshot.data)
    );
  }

}
