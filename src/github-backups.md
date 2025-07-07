# Automatically Backup [Observable](observablehq.com) notebooks to Github

Take control of your data and relax. Backup your public and team [Observable](https://observablehq.com) notebooks to a Github repository *automatically when published*.
By using a combination of [on version hook](https://observablehq.com/@endpointservices/onversion) which executes after a notebook is published, and [repository dispatch](https://observablehq.com/@tomlarkworthy/repository-dispatch) which starts a Github Action workflow, we can automatically export and unpack notebook source code to a Github repository every change.

The setup is a two step process.
1. In the notebooks, import and call `enableGithubBackups({ owner, repo })`
2. In the Github repository, setup an Action Workflow that downloads the `notebook.tar.gz` and unpacks it.

[Observable notebook exports](https://observablehq.com/@observablehq/downloading-and-embedding-notebooks) are ES6 modules with a HTML runner. You can easily run your notebooks without a dependency on Observable servers, or include the code in a build process. Take a look for yourself at our Github backups [here](https://github.com/endpointservices/observable-notebooks).

### Changes
- 2024-03-23 Removed v1 API sniffing by request of Observablehq staff, but it still works

## Import the Github backup notebook.


~~~js
import {enableGithubBackups, backupNowButton} from `@tomlarkworthy/github-backups`
~~~

## Call `enableGithubBackups({ owner, repo })`

In an Observable notebook call `enableGithubBackups({ owner, repo })` with the target Github repository for backups. For example,

~~~js 
enableGithubBackups({
  owner: "endpointservices",                   // Target Github username/organization
  repo: "observable-notebooks",                // Target Github repo
  allow: ['tomlarkworthy', 'endpointservices'] // [optional] Allowed source observablehq logins
})
~~~

This will open a webcode endpoint UI. Store a Github [access token](https://github.com/settings/tokens/new) in a secret named `github_token`, and bind it to the endpoint, as shown below. If you add an API key you can backup non-public team notebooks.

${await FileAttachment("image@1.png").image({style: 'max-width: 640px'})}

⚠️ You notebook must be public *or* you must provide an API key for the backup process to read the source.


### Implementation

```js echo
function enableGithubBackups({ owner, repo, debugProxy, allow } = {}) {
  // Create onVersion hook, which simply forwards to the dispatchProxyEndpoint
  onVersion(async ({ id, version } = {}) => {
    // To check if this was called send a request to a honeypot
    fetch(
      `https://webcode.run/observablehq.com/@endpointservices/realtime-request-log` +
        `/version-${id}@${version}`
    );

    // Endpoints don't work in the thumbnail process, as they cannot figure out their top level slugs
    // However, as we have the id and version passed in we can derive it.
    let dispatchURL = `https://webcode.run/observablehq.com/d/${id};${dispatchProxyName(
      { owner, repo, event_type: "new_notebook_version" }
    )}`;
    // Now we forward this information to the dispatch function
    fetch(dispatchURL, {
      method: "POST",
      body: JSON.stringify({ url: await urlFromId(id), id, version })
    });
  });

  const dispatchBackup = createDispatchProxy({
    owner,
    repo,
    event_type: "new_notebook_version",
    client_payload: null,
    debug: debugProxy,
    beforeDispatch: async ({ client_payload } = {}, ctx) => {
      // Mixin the apiKey so Github can access private code exports
      client_payload.api_key = ctx.secrets.api_key;
    }
  });

  return dispatchBackup;
}
```

### Backup now button

It's useful, especially when setting up, to manually trigger the backup. Use the `backupNowButton()` function to trigger the Github workflow.

```js
backupNowButton = () =>
  Inputs.button("backup now", {
    reduce: async () => {
      const notebookURL = html`<a href="?">`.href
        .replace("https://", "")
        .replace("?", "");

      const dispatchName = Object.keys(window.deployments).find((n) =>
        n.endsWith("_new_notebook_version")
      );
      fetch(`https://webcode.run/${notebookURL};${dispatchName}`, {
        method: "POST",
        body: JSON.stringify({
          url: "https://" + notebookURL
        })
      });
    }
  })
```

### Backup all your public Notebooks

Once setup, the backup endpoint can backup *any* notebook. This is used by [manual-backup-all](https://observablehq.com/@tomlarkworthy/manual-backup-all) to scrape the Observable website and backup all discovered notebooks.



### What *enableGithubBackups* does

*enableGithubBackups* setups up an endpoint that receives `onVersion` hook that triggers backup repository workflow stored in Github. The endpoint sends the Github repository workflow an event_type of type `new_notebook_version` along with a client payload JSON containing the notebook `id` and `version` and authenticated with the `github_token` credentials.

Note the actual backup is performed by a Github Action.



## Setup `.github/workflows/backup.yml`

In a Github repository for backups, create a workflow for performing the backups. The following example comes from [endpointservices/observable-notebooks/.github/workflows/backup.yml](https://github.com/endpointservices/observable-notebooks/blob/main/.github/workflows/backup.yml). Note you can send all notebooks to the same repository as they are prefixed by Observable login and slug.

```bash
name: backups
on:
  repository_dispatch:
    types: [new_notebook_version]
    
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: backup
        run: |
          set -euo pipefail  
          # The URL is the notebook source, e.g. https://observablehq.com/@tomlarkworthy/github-backups 
          URL="\${{github.event.client_payload.url}}"
          # We convert this to @tomlarkworthy/github-backups by striping the prefix
          path="\${URL/https:\/\/observablehq.com\//}"
          
          echo 'url:  \${{github.event.client_payload.url}}'
          echo "path: \${path}"
          # NOTE: api_key parameter not printed for security reasons, but it may be present
          # Download tar from Observable directly (do not echo, may contain API key)
          curl "https://api.observablehq.com/\${path}.tgz?v=3&api_key=\${{github.event.client_payload.api_key}}" > notebook.tgz
          
          # Turn on echo of commands now
          set -x

          rm -rf "\${path}"
          mkdir -p "\${path}"
          tar -xf notebook.tgz -C "\${path}"
          git config --global user.name 'backup-to-github'
          git config --global user.email 'robot@webcode.run'
          git add "\${path}"
          git pull
          if ! git diff-index --quiet HEAD; then
            git commit -m 'Backup \${{github.event.client_payload.url}}   
            url:     \${{github.event.client_payload.url}}
            title:   \${{github.event.client_payload.title}}
            author:  \${{github.event.client_payload.author}}
            id:      \${{github.event.client_payload.id}}
            '
            git push
          fi
```


You can see if your workflow is triggering in the action sections of your repository in Github.

## Daily backup job

Because the `onVersion` hook is best effort, a [daily job](https://observablehq.com/@endpointservices/backups-failsafe) will also call the backup workflow to ensure backups converge to the latest.

## Example

The following cell backs up *this* notebook for real! [Here](https://github.com/endpointservices/observable-notebooks/blob/main/%40tomlarkworthy/github-backups/index.html) it is in Github (and the Action Workflow file is in that repository too). Of course, if you are not *tomlarkworthy* you cannot login the the endpoint below, and there is no way to access my personal *github_token* but it is there, enabling the integration.

```js
enableGithubBackups({
  owner: "endpointservices",
  repo: "observable-notebooks",
  allow: ["tomlarkworthy", "endpointservices"],
  debugProxy: true // Places breakpoint inside dispatch proxy (final step before Github)
})
```

```js
backupNowButton()
```

### Info

endpoint expects a request with the body of the form 

~~~
{
    "url": "https://observablehq.com/@tomlarkworthy/github-backups",
    "id": "..." // used to drive the download URL (https://api.observablehq.com/@tomlarkworthy/github-backups@642.tgz?v=3)
    "api_key": "..." // optional
}
~~~

### Utils

```js
urlFromId = async (id) => {
  const response = await (
    await fetchp(`https://api.observablehq.com/document/${id}/head?v=4`)
  ).json();
  if (response.slug) {
    return `https://observablehq.com/@tomlarkworthy/${response.slug}`;
  }
  return `https://observablehq.com/d/${id}`;
}
```

```js echo
urlFromId("d023d6fa23f3afd0")
```

## Dependencies

```js echo
trusted_domain = ["api.observablehq.com"]
```

```js
import { onVersion } from "@endpointservices/onversion"
```

```js
import {
  createDispatchProxy,
  dispatchProxyName
} from "@tomlarkworthy/repository-dispatch-min"
```

```js
import { footer } from "@endpointservices/footer"
```

```js echo
import { fetchp } with { trusted_domain as ALLOW_DOMAINS } from "@tomlarkworthy/fetchp"
```

```js
footer
```
