import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { FooterComponent } from "./footer/footer.component";
import { HomeComponent } from "./home/home.component";
import { MenuComponent } from "./menu/menu.component";

@NgModule({
    // declara os componentes
    declarations: [
        MenuComponent,
        HomeComponent,
        FooterComponent
    ],
    // importa outros modulos dependentes
    imports: [
        CommonModule,
        RouterModule
    ],
    // exportar os componentes do seu modulo
    exports: [
        MenuComponent,
        HomeComponent,
        FooterComponent
    ]
})

export class SharedModule {}