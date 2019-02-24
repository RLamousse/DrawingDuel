import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { SceneRendererService } from "./scene-renderer.service";

@Component({
  selector: "app-scene-creator",
  templateUrl: "./scene-creator.component.html",
  styleUrls: ["./scene-creator.component.css"],
})
export class SceneCreatorComponent implements AfterViewInit, OnInit {
  private renderService: SceneRendererService;
  private route: ActivatedRoute;
  public constructor() {
    this.renderService = new SceneRendererService();
  }

  private get originalContainer(): HTMLDivElement {
    return this.originalRef.nativeElement;
  }

  private get modifiedContainer(): HTMLDivElement {
    return this.modifiedRef.nativeElement;
  }

  @ViewChild("originalView")
  private originalRef: ElementRef;

  @ViewChild("modifiedView")
  private modifiedRef: ElementRef;

  @HostListener("window:resize", ["$event"])
  public onResize(): void {
    this.renderService.onResize();
  }
  public ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {

    });
  }
  public ngAfterViewInit(): void {
    this.renderService.init(this.originalContainer, this.modifiedContainer);
  }
}
