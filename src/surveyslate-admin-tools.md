# Survey Slate | Admin Tools

_Create, deploy and manage surveys._



```js
import markdownit from "markdown-it";
const Markdown = new markdownit({html: true});
function md(strings) {
  let string = strings[0];
  for (let i = 1; i < arguments.length; ++i) {
    string += String(arguments[i]);
    string += strings[i];
  }
  const template = document.createElement("template");
  template.innerHTML = Markdown.render(string);
  return template.content.cloneNode(true);
}
```




<style>
  /* Base (light) theme */
  .welcome-note {
    --note-bg: #e0ffff;     /* Light: pale cyan */
    --note-fg: #0b3d3d;     /* Light: deep teal text */
    --note-border: #9edede; /* Light: soft border */
    max-width: ${width/1.75}px;
    margin: 30px 0;
    padding: 15px 30px;
    background-color: var(--note-bg);
    color: var(--note-fg);
    border: 1px solid var(--note-border);
    border-radius: 10px;
    font: 700 18px/24px sans-serif;
  }

  /* Dark theme override when the browser prefers dark mode */
  @media (prefers-color-scheme: dark) {
    .welcome-note {
      --note-bg: #0f1f24;     /* Dark: deep blue-green */
      --note-fg: #d8ffff;     /* Dark: soft cyan text */
      --note-border: #245a61; /* Dark: subtle border */
    }
  }
</style>

<div class="welcome-note">${md`👋 Welcome!  This notebook is about **Survey Slate**&mdash;an [assemblage of Observable web-based notebooks](https://observablehq.com/collection/@categorise/survey-slate) allowing organizations to host custom surveys for end users on their own AWS infrastructure.  Check out the [Technical Overview](https://observablehq.com/@categorise/surveyslate-docs) to get started! ✨`}</div>

<!-- Notification design borrowed from https://observablehq.com/@jashkenas/inputs -->


```js echo
toc()
```

```js echo
md`## Log In`
```


You must have administrative permission to utilise this interface.


```js echo echo
manualCredentials
```

```js echo
md`Example credential format:
~~~js
{
  "accessKeyId": "LONGRANDOMSTRING",
  "secretAccessKey": "eVeN1OnGeRRaNd3MstR*%G"
}
~~~
`
```

```js echo
md`
For convenience and persistence across browsing sessions, you may choose to save your credentials to local storage (or clear them, should you wish).
`
```

```js echo
saveCreds
```


---


## Applications

Deploy the core applications of Open Survey into Cloud

<ul>
<li>[Survey Designer](https://www.surveyslate.org/demo-designer/index.html)</li>
<li>[Survey Filler](https://www.surveyslate.org/demo-survey/index.html?username=demoResponder#FnMcjZO1pn1uqmMh|cell-types)</li>
<ul>


```js echo
const CLOUD_FRONT_DISTRIBUTION_ID = config.CLOUD_FRONT_DISTRIBUTION_ID;
```

```js echo
md`### Deploy the *Survey Designer* Application to [CloudFront](https://d3f26ej57oauer.cloudfront.net/designer/index.html)`
```

```js echo
//viewof uploadDesignerBtn
const uploadDesignerBtnElement = uploadDesignerBtn;
const uploadDesignerBtn = Generators.input(uploadDesignerBtnElement);
display(uploadDesignerBtnElement)
```

```js echo
designerFiles
```

```js echo
designerCurrentFileUpload
```

```js echo
designerUploader
```

```js echo
const designerSource = "https://observablehq.com/@categorise/survey-designer"
```

```js echo
const designerS3Target = config.PUBLIC_BUCKET + "/apps/demo-designer"
```

```js echo
const designerInvalidationPath = "/designer/*"
```

```js echo
const designerIndex = `<!DOCTYPE html>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Survey Slate Designer</title>
<link rel="stylesheet" type="text/css" href="./inspector.css">
<body data-standalone-designer-notebook>
${enableJavasscriptSnippet.outerHTML}
<div id="root"class="[ mw8 pa4 pt2 ml-auto mr-auto ][ brand-font ][ space-y-3 ]"></div>
<script type="module">
import define from "./index.js";
import {Runtime, Library, Inspector} from "./runtime.js";

const rootEl = document.querySelector("#root") || document.body;

new Runtime().module(define, name => {
  if (name === "styles") {
    return Inspector.into(rootEl)();
  }
  if (name === "loadStyles") {
    return Inspector.into(rootEl)();
  }
  if (name === "loginTitle") {
    return Inspector.into(rootEl)();
  }
  if (name === "viewof login") {
    return Inspector.into(rootEl)();
  }
  if (name === "credStore") {
    return Inspector.into(rootEl)();
  }
  if (name === "surveyChooserTitle") {
    return Inspector.into(rootEl)();
  }
  if (name === "viewof survey") {
    return Inspector.into(rootEl)();
  }
  if (name === "viewof settings") {
    return true;
  }
  if (name === "initialQuestionLoader") {
    return true;
  }
  if (name === "initialLayoutLoader") {
    return true;
  }
  if (name === "load_config") {
    return true;
  }
  if (name === "sync_ui") {
    return true;
  }
  if (name === "viewof surveyUi") {
    return Inspector.into(rootEl)();
  }
  if (name === "viewof surveyUiInput") {
    return true;
  }
  if (name === "syncSurveyUiInputToSurveyUi") {
    return true;
  }
  if (name === "syncSurveyUIToSurveyUiOutput") {
    return true;
  }
  if (name === "syncSurveyOutput") {
    return true;
  }
  if (name === "autosave") {
    return true;
  }
  if (name === "viewof latestConfig") {
    return Inspector.into(rootEl)();
  }
  if (name === "surveyPreviewTitle") {
    return Inspector.into(rootEl)();
  }
  if (name === "viewof responses") {
    return Inspector.into(rootEl)();
  }
  if (name === "revertTitle") {
    return Inspector.into(rootEl)();
  }
  if (name === "viewof reollbackButton") {
    return Inspector.into(rootEl)();
  }
  if (name === "deployTitle") {
    return Inspector.into(rootEl)();
  }
  if (name === "lastDeployed") {
    return Inspector.into(rootEl)();
  }
  if (name === "viewof deployButton") {
    return Inspector.into(rootEl)();
  }
});
</script>
`
```

```js echo
import {
  //viewof uploadButton as uploadDesignerBtn,
  uploadButton as uploadDesignerBtn,
  currentFile as designerCurrentFileUpload,
  uploader as designerUploader,
  deployed as designerDeployed,
  files as designerFiles
} with {
  designerIndex as indexHtml,
  designerInvalidationPath as INVALIDATION_PATH,
  designerSource as notebookURL,
  designerS3Target as s3Target,
  manualCredentials, CLOUD_FRONT_DISTRIBUTION_ID}
from '@tomlarkworthy/notebook-deploy-to-s3'
```

### Deploy *Survey Filler* Application to CloudFront

- [Amazon CloudFront introduction](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Introduction.html)
- [Survey Filler testUser on CloudFront](https://d3f26ej57oauer.cloudfront.net/survey/index.html?username=testUser&0.3111558664622356#Kp0YtJIgI6RuUWUo)
- [Survey Filler testUser on S3](https://public-publicwrfxcsvqwpcgcrpx.s3.us-east-2.amazonaws.com/apps/survey/index.html?username=testUser&survey=testProject3&0.3111558664622356#Kp0YtJIgI6RuUWUo|intro) useful for bisecting deployment problems as CloudFront reads from S3.

```js echo
//viewof runFillerTests = Inputs.toggle({
const runFillerTestsElement = Inputs.toggle({
  label: md`<b>I have run the [integration tests](https://observablehq.com/@categorise/opensurvey?username=demoResponder#FnMcjZO1pn1uqmMh|cell-types)?<b>`
});
const runFillerTests = Generators.input(runFillerTestsElement);
display(runFillerTestsElement)
```

```js echo
{
  if (runFillerTests) return viewof uploadFillerBtn
  else return md`Run the integration tests before deploying.`
}
```

```js echo
fillerFiles
```

```js echo
fillerUploader
```

```js echo
fillerCurrentFileUpload
```

```js echo
const fillerSource = "https://observablehq.com/@categorise/surveyslate-filler"
```

```js echo
const fillerS3Target = config.PUBLIC_BUCKET + "/apps/demo-survey"
```

```js echo
const fillerInvalidationPath = "/survey/*"
```

```js echo
const fillerIndex = `<!DOCTYPE html>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Survey Slate Filler</title>
<link rel="stylesheet" type="text/css" href="./inspector.css">
<body data-standalone-survey="true">
${enableJavasscriptSnippet.outerHTML}
<script type="module">
import define from "./index.js";
import {Runtime, Library, Inspector} from "./runtime.js";

new Runtime().module(define, name => {
  if (name === "viewof responses") {
    return Inspector.into(document.body)();
  }
  if (name === "auto_save") {
    return true;
  }
});
</script>
`
```

```js echo
import {
  viewof uploadButton as uploadFillerBtn,
  currentFile as fillerCurrentFileUpload,
  uploader as fillerUploader,
  deployed as fillerDeployed,
  files as fillerFiles
} with {
  fillerInvalidationPath as INVALIDATION_PATH,
  fillerSource as notebookURL,
  fillerS3Target as s3Target,
  fillerIndex as indexHtml,
  manualCredentials, CLOUD_FRONT_DISTRIBUTION_ID}
from '@tomlarkworthy/notebook-deploy-to-s3'
```

## Operations

### Survey

Each survey has a folder in the in s3 at \`PRIVATE_BUCKET/surveys/{name}\`. 

Projects are surveys: the text, questions, and logical connections defined by survey designer. 

### List Surveys

```js echo
Inputs.table(surveys)
```

#### Create Survey

```js
//viewof newSurveyName = Inputs.text({
const newSurveyNameElement = Inputs.text({
  label: "Survey name",
  submit: "create",
  pattern: "^[a-Z]*$",
  minlength: 3
});
const newSurveyName = Generators.input(newSurveyNameElement);
display(newSurveyNameElement)
```

```js echo
{
  await putObject(config.PRIVATE_BUCKET, `surveys/${newSurveyName}/settings.json`, `{"name":"${newSurveyName}"}`, {
    tags: {
      "survey": newSurveyName
    }
  })
  viewof newSurveyName.value = undefined
  mutable refreshProjects++;
  return md`<mark>${newSurveyName} created</mark>`
}
```

```js echo
const surveys = refreshProjects && (await listObjects(config.PRIVATE_BUCKET, "surveys/")).map(r => ({name: /surveys\/([^/]*)\//.exec(r.Prefix)[1]}))
```

```js
//!!!!!!!!!!!!!!!
//!!!!!!!!!!!!!!!
//!!!!!!!!!!!!!!!
mutable refreshProjects = 1
```


---


### Accounts

Each account has a folder in the in s3 at \`CONFIDENTIAL_BUCKET/accounts/{name}\`. 

Accounts contain survey responses: answers supplied to survey questions by survey fillers. Accounts are assigned to projects.


### List Accounts

```js echo
Inputs.table(accounts)
```

#### Create Account

```js echo
//viewof newAccountName = Inputs.text({
const newAccountNameElement = Inputs.text({
  label: "New account",
  submit: "create",
  pattern: "^[a-Z]*$",
  minlength: 3
});
const newAccountName = Generators.input(newAccountNameElement);
display(newAccountNameElement)

```

```js echo
{
  await putObject(config.CONFIDENTIAL_BUCKET, `accounts/${newAccountName}/settings.json`, `{"name":"${newAccountName}"}`, {
    tags: {
      "account": newAccountName
    }
  });
  viewof newAccountName.value = undefined
  mutable refreshAccounts++;
  return md`<mark>${newAccountName} created</mark>`
}
```

```js echo
accounts = refreshAccounts && (await listObjects(config.CONFIDENTIAL_BUCKET, "accounts/")).map(r => ({name: /accounts\/([^/]*)\//.exec(r.Prefix)[1]}))
```

```js echo
mutable refreshAccounts = 1
```


---


### Users

Users have IAM user credentials, which allow access to the application or backend.

We use AWS IAM tags to add information such as access to survey projects or account response locations.


#### List Users

```js echo
Inputs.table(users, {
  columns: ['UserName', 'UserId', 'Tags', 'PasswordLastUsed', 'CreateDate']
})
```

#### Create User

```js echo
//viewof newUsername = Inputs.text({
const newUsernameElement = Inputs.text({
  label: "New user",
  submit: "create",
  pattern: "^[a-Z]*$",
  minlength: 3
});
const newUsername = Generators.input(newUsernameElement);
display(newUsernameElement)

```

```js echo
{
  await createUser(newUsername)
  await addUserToGroup(newUsername, "user")
  viewof newUsername.value = undefined
  mutable refreshUsers++;
  return md`<mark>${newUsername} created</mark>`
}
```

#### Delete User

```js echo
//viewof deleteUsername = Inputs.text({
const deleteUsernameElement = Inputs.text({
  label: "Delete user",
  submit: "delete",
  pattern: "^[a-Z]*$",
  minlength: 3
});
const deleteUsername = Generators.input(deleteUsernameElement);
display(deleteUsernameElement)

```

```js echo
{
  const groups = await listGroupsForUser(deleteUsername);
  await Promise.all(groups.map(group => removeUserFromGroup(deleteUsername, group.GroupName)))
  await deleteUser(deleteUsername)
  viewof deleteUsername.value = undefined
  mutable refreshUsers++;
  return md`<mark>${deleteUsername} delete</mark>`
}
```

```js echo
const users = refreshUsers && await listUsers()
```

```js echo
//!!!!!!!!!!!!!!!!!!!!!!!
//!!!!!!!!!!!!!!!!!!!!!!!
//!!!!!!!!!!!!!!!!!!!!!!!
mutable refreshUsers = 1;
```

### User Permissions

Actions that a user may perform are explicitly defined by user permissions. We have fillers (survey respondents) and designers and members of account.

A user can only fill in a survey for an account if they have permission on that account. Similarly, a user can only design and modify a survery project if they have are tagged as a designer. 


```js echo
//viewof username = Inputs.bind(Inputs.select(users.map(u => u.UserName), {
//  label: "Choose a user to configure"
//}), localStorageView("username"))
const usernameElement = Inputs.bind(
  Inputs.select(users.map(u => u.UserName), {
    label: "Choose a user to configure"
  }),
  localStorageView("username")
);
const username = Generators.input(usernameElement);
display(usernameElement)
```

```js echo
const user = users.find(r => r.UserName === username)
```

```js echo
Inputs.table(userGroups, {
  columns: ["GroupName", "GroupId", "Arn", "CreateDate"]
})
```

```js echo
//userGroups = listGroupsForUser(username)
const userGroupsElement = listGroupsForUser(username);
const userGroups = Generators.input(userGroupsElement);
display(userGroupsElement)
```

#### IAM Access Keys (${username})

```js echo
Inputs.table(userAccessKeys)
```

##### Add access key

##### Create an internal access key for this user

remember to record the secret as it will not be visible ever again. Suitable for staff.


```js echo
{
  if (userAccessKeys.length >= 2) return md`⚠️ max 2 access keys reached per user, delete an access key first`
  else return Inputs.button("Create INTERNAL access key", {
    reduce: async () => {
      const newKey = await createAccessKey(username);
      mutable lastAccessKey = JSON.stringify({
        "accessKeyId": newKey.AccessKeyId,
        "secretAccessKey": newKey.SecretAccessKey
      }, null, 2)
      mutable refreshUsers++;
    }
  })
}
```

```js
//!!!!!!!!!!!!!!!!
//!!!!!!!!!!!!!!!!
//!!!!!!!!!!!!!!!!
mutable lastAccessKey = undefined
```

##### Create an external access code (suitable for Survey Fillers)

This creates an access key like the internal access key, but stores it encrypted publically in S3. The password is stored in the PRIVATE_BUCKET so it can be used to generate access URLs.

You can generate multiple access links off this credentials using [access_links](#access_links)


```js echo
{
  if (userAccessKeys.length >= 2) return md`⚠️ max 2 access keys reached per user, delete an access key first`
    else return Inputs.button("Add EXTERNAL access key", {
    reduce: async () => {
      try {
        const password = await randomId(16);
        const newKey = await createAccessKey(username);
        const payload = await encrypt({
          secret: JSON.stringify({
            "accessKeyId": newKey.AccessKeyId,
            "secretAccessKey": newKey.SecretAccessKey
          }, null, 2),
          password
        });

        const path = `credentials/${await new hashes.SHA256().hex(username)}.json`;
        await putObject(config.PUBLIC_BUCKET, path, JSON.stringify(payload, null, 2));
        await putObject(config.PRIVATE_BUCKET, `passwords/${await new hashes.SHA256().hex(username)}`, password);
      } catch (err) {
        console.error(err);
      }
      mutable refreshUsers++;
    }
  });
}
```

##### Delete access key

```js echo
//viewof deleteAccessKeyInput = Inputs.text({
const deleteAccessKeyInputElement = Inputs.text({
  label: "Delete AccessKeyId",
  submit: "delete",
  pattern: "^[a-Z]*$",
  minlength: 3
});
const deleteAccessKeyInput = Generators.input(deleteAccessKeyInputElement);
display(deleteAccessKeyInputElement)
```

```js echo
{
  const key = deleteAccessKeyInput.trim()
  if (key == "") return;
  await deleteAccessKey(username, key)
  //viewof deleteAccessKeyInput.value = " "
  deleteAccessKeyInputElement.value = " "
  //viewof deleteAccessKeyInput.dispatchEvent(new Event('input', {bubbles: true}));
  deleteAccessKeyInputElement.dispatchEvent(new Event('input', {bubbles: true}));
  mutable refreshUsers++;
  return md`<mark>${deleteAccessKey} deleted</mark>`
}
```

```js echo
const userAccessKeys = listAccessKeys(username)
```
#### Survey Designer Access Tags (${username})

For a user to be able to use the survey builder for a project, they must be added as a designer to the survey.


```js echo
Inputs.table(userSurveys.map(r => ({project: r})))
```

```js echo
//viewof userSurvey = Inputs.select(surveys.map(p => p.name), {label: "select survey for operation"})
const userSurveyElement = Inputs.select(surveys.map(p => p.name), {
  label: "select survey for operation"
});
const userSurvey = Generators.input(userSurveyElement);
display(userSurveyElement)

```

##### Add user as a designer to a survey

```js echo
Inputs.button(md`add *${username}* to *${userSurvey}* as a designer`, {
  reduce: async () => {
    await tagUser(username, {
      "designer": [...new Set(userSurveys.concat(`${userSurvey}`))].join(" ")
    })
    mutable refreshTags++;
  }
})
```

##### Remove user as a designer from a survey

```js echo
Inputs.button(md`remove *${username}* from *${userSurvey}* as a designer`, {
  reduce: async () => {
    await tagUser(username, {
      "designer": [...new Set(userSurveys.filter(p => p !== `${userSurvey}`))].join(" ")
    })
    mutable refreshTags++;
  }
})
```

```js echo
const userSurveys = (userTags["designer"] || "").split(" ").filter(v => v !== "")
```

#### Survey Filler Access Tags (${username})

For a user to fill out a survey, they must 1. be added as a filler for that project (and 2. also as a member of an account, which is next).



```js echo
Inputs.table(userFills.map(r => ({represents: r})))
```

```js echo
viewof userFiller = Inputs.select(surveys.map(p => p.name), {label: "select survey for operation"})
//viewof userFiller = Inputs.select(surveys.map(p => p.name), {label: "select survey for operation"})
const userFillerElement = Inputs.select(surveys.map(p => p.name), {
  label: "select survey for operation"
});
const userFiller = Generators.input(userFillerElement);
display(userFillerElement)

```

##### Add user as a filler to a survey project

```js echo
Inputs.button(md`add *${username}* to *${userFiller}* as a filler`, {
  reduce: async () => {
    await tagUser(username, {
      "filler": [...new Set(userFills.concat(`${userFiller}`))].join(" ")
    })
    mutable refreshTags++;
  }
})
```

##### Remove user as a filler to a survey project

```js echo
Inputs.button(md`remove *${username}* from *${userFiller}* as a filler`, {
  reduce: async () => {
    await tagUser(username, {
      "filler": [...new Set(userFills.filter(p => p !== `${userFiller}`))].join(" ")
    })
    mutable refreshTags++;
  }
})
```

```js echo
const userFills = (userTags["filler"] || "").split(" ").filter(v => v !== "")
```

#### Survey Filler Account Tags (${username})

A filler must be a member of an account to fill out a survey.


```js echo
Inputs.table(userAccounts.map(r => ({represents: r})))
```

```js echo
//viewof userAccount = Inputs.select(accounts.map(p => p.name), {label: "select account for operation"})
const userAccountElement = Inputs.select(accounts.map(p => p.name), {
  label: "select account for operation"
});
const userAccount = Generators.input(userAccountElement);
display(userAccountElement)

```

##### Add user as a survery filler to a survey project

```js echo
Inputs.button(md`Allow *${username}* to respond on behalf of *${userAccount}*`, {
  reduce: async () => {
    await tagUser(username, {
      "account": [...new Set(userAccounts.concat(`${userAccount}`))].join(" ")
    })
    mutable refreshTags++;
  }
})
```

##### Remove user as a survery filler from a survey project

```js echo
Inputs.button(md`Deny *${username}* to respond on behalf of *${userAccount}*`, {
  reduce: async () => {
    await tagUser(username, {
      "customer": [...new Set(userAccounts.filter(p => p !== `${userAccount}`))].join(" ")
    })
    mutable refreshTags++;
  }
})
```

```js echo
const access_links = md`#### Access links

Access links are web links to the survey application. Survey fillers can access a survery via a secret URL, which avoids them having to deal with credentials.
`
```

```js echo
Inputs.button(md`Generate access link for *${username}*`, {
  reduce: async () => {
    const password = `${await getObject(config.PRIVATE_BUCKET, `passwords/${await new hashes.SHA256().hex(username)}`)}`  
    
    viewof access_link.value = `${config.FILLER_APP_URL}?username=${encodeURIComponent(username)}#${password}`
  }
})
```

```js echo
//viewof access_link = {
const access_linkElement = () => {
  const link = document.createElement("a")
  link.target = "_blank"
  return Object.defineProperty(link, 'value', {
    get: () => link.href,
    set: (newLink) => {
      link.href = newLink;
      link.innerHTML = newLink
    },
    enumerable: true
  });                          
}
const access_link = Generators.input(access_linkElement
display(access_linkElement)
)
```

```js echo
const userAccounts = (userTags["account"] || "").split(" ").filter(v => v !== "")
```

#### All tags for a user (${username})

This shows all tags at are active on a user account (useful for debugging)


```js echo
Inputs.table(Object.entries(userTags).map(r => ({"key": r[0], "value": r[1]})), {
  
})
```

```js echo
const userTags = refreshTags && listUserTags(username)
```

```js echo
mutable refreshTags = 1;
```

## AWS Configuration

```js echo
const REGION = "us-east-2"
```

### IAM User Groups

User groups broadly control access policy. Groups are preconfigured outside of this application, in the AWS IAM console. 

Our application distinguishes only between 'admins' (users with control of the AWS account) and 'users' (those who may create and maintain surveys and discover their fine-grained permissions). Fine-grained permissions are toggled with user tags in the [user permissions](#user-permissions) section.


```js echo
Inputs.table(groups, {
  columns: ["GroupName", "GroupId", "Arn", "CreateDate"]
})
```


All users can query information about themselves and their own tags, so that they can self-discover resource access.

      ~~~js
      {
        "Effect": "Allow",
        "Action": [
          "iam:GetUser",
          "iam:ListUserTags"
        ],
        "Resource": "arn:aws:iam::032151534090:user/\${aws:username}"
      }
      ~~~

Enforcing that a user can only access projects they are assigned is achieved by a policy on the object tags in the S3 bucket:

    ~~~js
    {
      "Effect": "Allow",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::private-mjgvubdpwmdipjsn/*",
      "Condition": {
        "StringLike": {
          "aws:PrincipalTag/designer": "*\${s3:ExistingObjectTag/project}*"
        }
      }
    }
    ~~~

We enforce that designers can only upload files for their projects:

    ~~~js
    {
        "Effect": "Allow",
        "Action": [
            "s3:putObjectTagging"
            "s3:PutObject"
        ],
        "Resource": "arn:aws:s3:::private-mjgvubdpwmdipjsn/*",
        "Condition": {
            "StringLike": {
                "aws:PrincipalTag/designer": "*\${s3:RequestObjectTag/project}*"
            }
        }
    }
    ~~~


```js echo
const groups = listGroups()
```

```js echo
//import {config} from '@categorise/surveyslate-components'
import {config} from '/components/survey-components.js'
```

## Imports

```js echo
//import {listObjects, getObject, putObject, listUsers, createUser, deleteUser, getUser, listAccessKeys, createAccessKey, deleteAccessKey, viewof manualCredentials, saveCreds, listUserTags, tagUser, untagUser, iam, s3, listGroups, listGroupsForUser, addUserToGroup, removeUserFromGroup, createInvalidation} with {REGION as REGION} from '@tomlarkworthy/aws'
import {listObjects, getObject, putObject, listUsers, createUser, deleteUser, getUser, listAccessKeys, createAccessKey, deleteAccessKey, viewof manualCredentials, saveCreds, listUserTags, tagUser, untagUser, iam, s3, listGroups, listGroupsForUser, addUserToGroup, removeUserFromGroup, createInvalidation} with {REGION as REGION} from '/components/aws.js'
```

```js echo
//import {toc} from "@bryangingechen/toc"
import {toc} from "/components/toc.js"
```

```js echo
//import {encrypt} from '@endpointservices/notebook-secret'
import {encrypt} from '/components/notebook-secret.js'
```

```js echo
//import {randomId} from '@tomlarkworthy/randomid'
import {randomId} from '/components/randomid.js'

```

```js echo
//import {localStorageView} from '@tomlarkworthy/local-storage-view'
import {localStorageView} from '/contents/local-storage-view.js'
```

```js echo
//import {enableJavasscriptSnippet} from '@categorise/gesi-styling'
import {enableJavasscriptSnippet} from '/components/gesi-styling.js'

```

```js echo
//const hashes = require("jshashes")
import Hashes from "jshashes";
```

---

```js
//import { substratum } from "@categorise/substratum"
```

```js
//substratum({ invalidation })
```
