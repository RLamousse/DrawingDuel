import { Component, AfterViewInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { SceneRendererService } from "./scene-renderer.service";

@Component({
  selector: 'app-scene-creator',
  templateUrl: './scene-creator.component.html',
  styleUrls: ['./scene-creator.component.css']
})
export class SceneCreatorComponent implements AfterViewInit {

  constructor(private renderService: SceneRendererService) { }

  private get container(): HTMLDivElement {
    return this.containerRef.nativeElement;
  }

  @ViewChild('container')
  private containerRef: ElementRef;

  @HostListener('window:resize', ['$event'])
  public onResize() {
    this.renderService.onResize();
  }

  public ngAfterViewInit() {
    this.renderService.init(this.container);
  }

}
