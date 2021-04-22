import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ModeThemeSwitchComponent} from './components/mode-theme-switch/mode-theme-switch.component';
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {FlexLayoutModule} from "@angular/flex-layout";
import { GenericNotFoundComponent } from './components/generic-not-found/generic-not-found.component';


@NgModule({
  declarations: [ModeThemeSwitchComponent, GenericNotFoundComponent],
  imports: [
    CommonModule,
    MatSlideToggleModule,
    FlexLayoutModule,
  ],
  exports: [
    ModeThemeSwitchComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppSharedModule {
}
