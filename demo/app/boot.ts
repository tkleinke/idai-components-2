/// <reference path="../../typings/browser/ambient/es6-shim/index.d.ts" />
/// <reference path="../../typings/browser/ambient/node/index.d.ts" />

import {bootstrap}    from '@angular/platform-browser-dynamic'
import {AppComponent} from './app.component'
import {HTTP_PROVIDERS} from '@angular/http';
import {provide, enableProdMode} from '@angular/core';
import {Datastore} from "../../lib/app/datastore/datastore";
import {Messages} from "../../lib/app/core-services/messages";
import {MemoryDatastore} from "./memory-datastore";
import {ConfigLoader} from "../../lib/app/object-edit/config-loader";
import {PersistenceManager} from "../../lib/app/object-edit/persistence-manager";
import {MD} from "../../lib/app/core-services/md";
import { ROUTER_PROVIDERS } from '@angular/router';
import {LocationStrategy, HashLocationStrategy} from '@angular/common';

bootstrap(AppComponent, [
    ROUTER_PROVIDERS,
    HTTP_PROVIDERS,
    provide(LocationStrategy, { useClass: HashLocationStrategy }),
    provide(Datastore, { useClass: MemoryDatastore }),
    provide(Messages, { useClass: Messages }),
    provide(ConfigLoader, {useClass: ConfigLoader}),
    provide(PersistenceManager, {useClass: PersistenceManager}),
    provide(ConfigLoader, {useClass: ConfigLoader}),
    provide(MD, {useClass: MD})
]);