import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Product } from '../../api/product';
import { ProductService } from '../../service/product.service';
import { Subscription, debounceTime } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { Router } from '@angular/router';
import * as OBC from "@thatopen/components";

@Component({
    templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit, OnDestroy {

    loading: boolean = false;

    constructor(public layoutService: LayoutService, public router: Router) { }
    ngOnDestroy(): void {
        throw new Error('Method not implemented.');
    }

    ngOnInit() {
        this.loading = false;
        const container = document.getElementById("container")!;
        const components = new OBC.Components();
        const worlds = components.get(OBC.Worlds);
        const input = document.getElementById("file-input");
        const world = worlds.create<
            OBC.SimpleScene,
            OBC.SimpleCamera,
            OBC.SimpleRenderer
        >();

        world.scene = new OBC.SimpleScene(components);
        world.renderer = new OBC.SimpleRenderer(components, container);
        world.camera = new OBC.SimpleCamera(components);

        components.init();

        world.camera.controls.setLookAt(12, 6, 8, 0, 0, -10);

        world.scene.setup();

        const grids = components.get(OBC.Grids);
        grids.create(world);

        const fragments = components.get(OBC.FragmentsManager);
        const fragmentIfcLoader = components.get(OBC.IfcLoader);

        // initialize the library

        fragmentIfcLoader.settings.wasm = {
            path: 'assets/file',
            absolute: true,
        };
        this.setFragments(fragmentIfcLoader, world);

        fragments.onFragmentsLoaded.add((model) => {
            console.log(model);
        });

        input.addEventListener(
            "change",
            async (changed: any) => {
                const file = changed.target.files[0];
                const data = await file.arrayBuffer();
                const buffer = new Uint8Array(data);
                const model = await fragmentIfcLoader.load(buffer);
                world.scene.three.add(model);
            },
            false
        );
    }

    async setAPI(ifcApi: any) {
        await ifcApi.Init();
    }
    async setFragments(fragmentIfcLoader: any, world) {
        await fragmentIfcLoader.setup();
        fragmentIfcLoader.settings.webIfc.COORDINATE_TO_ORIGIN = true;
        this.loadIfc(fragmentIfcLoader, world);
    }

    async loadIfc(fragmentIfcLoader: OBC.IfcLoader, world: OBC.World) {
        const file = await fetch(
            "https://thatopen.github.io/engine_components/resources/small.ifc",
        );

    }
}
