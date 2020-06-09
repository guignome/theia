/********************************************************************************
 * Copyright (C) 2018 TypeFox and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/

import { interfaces } from 'inversify';
import { GitDiffContribution } from './git-diff-contribution';
import { WidgetFactory, bindViewContribution, TreeModel } from '@theia/core/lib/browser';
import { GitDiffWidget, GIT_DIFF } from './git-diff-widget';
import { GitDiffHeaderWidget } from './git-diff-header-widget';
import { GitDiffTreeModel } from './git-diff-tree-model';
import { TabBarToolbarContribution } from '@theia/core/lib/browser/shell/tab-bar-toolbar';
import { ScmTreeModel } from '@theia/scm/lib/browser/scm-tree-model';
import { createScmTreeContainer } from  '@theia/scm/lib/browser/scm-frontend-module';
import '../../../src/browser/style/diff.css';

export function bindGitDiffModule(bind: interfaces.Bind): void {

    bind(GitDiffWidget).toSelf();
    bind(WidgetFactory).toDynamicValue(ctx => ({
        id: GIT_DIFF,
        createWidget: () => {
            const child = createScmTreeContainer(ctx.container);
            child.bind(TreeModel).toService(GitDiffTreeModel);

            child.bind(GitDiffHeaderWidget).toSelf();
            child.bind(GitDiffTreeModel).toSelf();
            child.bind(ScmTreeModel).toService(GitDiffTreeModel);
            return child.get(GitDiffWidget);
        }
    })).inSingletonScope();

    bindViewContribution(bind, GitDiffContribution);
    bind(TabBarToolbarContribution).toService(GitDiffContribution);

}
