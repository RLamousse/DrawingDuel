import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute} from "@angular/router";
import { IScene } from "../../../scene-interface";
import { SceneRendererService } from "./scene-renderer.service";

@Component({
  selector: "app-scene-creator",
  templateUrl: "./scene-creator.component.html",
  styleUrls: ["./scene-creator.component.css"],
})
export class SceneCreatorComponent implements AfterViewInit, OnInit {

  public constructor(private renderService: SceneRendererService, private route: ActivatedRoute, ) { }

  protected gameName: string;
  protected isSimpleGame: boolean;
  protected freeScenes: IScene;

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
      this.isSimpleGame = params ["isSimpleGame"];
      this.gameName = params["gameName"];
      this.freeScenes = params["freeScenes"];
    });
  }

  public ngAfterViewInit(): void {
    this.renderService.init(this.originalContainer, this.modifiedContainer);
    this.renderService.loadScenes(this.freeScenes.scene, this.freeScenes.modifiedScene, this.originalContainer, this.modifiedContainer);
  }
}
