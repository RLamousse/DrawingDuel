import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from "@angular/core";
import { SceneRendererService } from "./scene-renderer.service";

@Component({
  selector: "app-scene-creator",
  templateUrl: "./scene-creator.component.html",
  styleUrls: ["./scene-creator.component.css"],
})
export class SceneCreatorComponent implements AfterViewInit {

  public constructor(private renderService: SceneRendererService) { }

  private get container(): HTMLDivElement {
    return this.containerRef.nativeElement;
  }

  @ViewChild("container")
  private containerRef: ElementRef;

  @HostListener("window:resize", ["$event"])
  public onResize(): void {
    this.renderService.onResize();
  }

  public ngAfterViewInit(): void {
    this.renderService.init(this.container);
  }

}
