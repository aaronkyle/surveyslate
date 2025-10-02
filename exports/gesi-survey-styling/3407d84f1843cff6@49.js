import define1 from "./bad810ff1e80611b@137.js";

function _1(md){return(
md`# Survey Slate | Configuration`
)}

function _config(){return(
{
  // All artifacts in the PUBLIC bucket are on the internet
  PUBLIC_BUCKET: "public-publicwrfxcsvqwpcgcrpx",
  // The private bucket requires credentials to access, should be for system wide things like user lists
  PRIVATE_BUCKET: "private-mjgvubdpwmdipjsn",
  // The confidential bucket is for customer data, it is encypted and access shoudl be minimized.
  CONFIDENTIAL_BUCKET: "confidential-bspqugxjstgxwjnt",
  // The URL to redirect users to when minting external credentials
  FILLER_APP_URL: "https://www.surveyslate.org/survey/index.html",
  // Default survey when minting credentials,
  DEFAULT_SURVEY: "gesi_survey",
  // Fill app staging environment for testing code changes
  FILLER_APP_STAGING_URL: "https://www.surveyslate.org/survey-staging/index.html",
  // Cloud Front distribution ID
  CLOUD_FRONT_DISTRIBUTION_ID: 'EG13QGKCG6LI9',
  // URL that hosts appplications
  CLOUD_FRONT_URL: 'https://www.surveyslate.org',
}
)}

function _notebooks(){return(
{
  configuration: "https://observablehq.com/@adb/survey-slate-configuration?collection=@adb/gesi-self-assessment",
  admin: "https://observablehq.com/@adb/gesi-survey-admin-tools?collection=@adb/gesi-self-assessment",
  designer: "https://observablehq.com/@adb/gesi-survey-designer-tools?collection=@adb/gesi-self-assessment",
  filler: "https://observablehq.com/@adb/gesi-survey-filler?collection=@adb/gesi-self-assessment",
  technical: "https://observablehq.com/@adb/gesi-survey-technical-overview?collection=@adb/gesi-self-assessment",
  manual: "https://observablehq.com/@adb/user-guide-for-gesi-survey-designer?collection=@adb/gesi-self-assessment",
  "gesi-components": "https://observablehq.com/@adb/gesi-survey-common-components?collection=@adb/gesi-self-assessment",
  "gesi-style": "https://observablehq.com/@adb/gesi-survey-styling?collection=@adb/gesi-self-assessment",
  "survey-slate-style": "https://observablehq.com/@adb/survey-slate-styling?collection=@adb/gesi-self-assessment",
  "survey-slate-components" : "https://observablehq.com/@adb/survey-slate-common-components?collection=@adb/gesi-self-assessment",
  components: "https://observablehq.com/@adb/gesi-survey-components?collection=@adb/gesi-self-assessment",
  component_designer_ui: "https://observablehq.com/@adb/gesi-survey-designer-ui?collection=@adb/gesi-self-assessment",
  analysis: "https://observablehq.com/@adb/analysis-template?collection=@adb/gesi-self-assessment",
  credential: "https://observablehq.com/@adb/gesi-self-assessment-credentials?collection=@adb/gesi-self-assessment", 
}
)}

function _links(){return(
{
  public_bucket: "https://s3.console.aws.amazon.com/s3/buckets/public-publicwrfxcsvqwpcgcrpx?region=us-east-1",
  private_bucket: "https://s3.console.aws.amazon.com/s3/buckets/private-mjgvubdpwmdipjsn?region=us-east-1",
  confidential_bucket: "https://s3.console.aws.amazon.com/s3/buckets/confidential-bspqugxjstgxwjnt?region=us-east-1",
  iam_policy: "https://us-east-1.console.aws.amazon.com/iam/home#/policies/arn:aws:iam::032151534090:policy/user$jsonEditor",
  gesi_content: "https://docs.google.com/spreadsheets/d/1R9xJxF-Ry0SljqNfg9iiCcwRqDUU9hvc"
}
)}

function _accounts(){return(
{
  username_demo: "demoResponder",
  password_demo: "FnMcjZO1pn1uqmMh",
  username_test: "testUser",
  password_test: "Kp0YtJIgI6RuUWUo",
}
)}

function _6(md){return(
md`---`
)}

function _8(substratum,invalidation){return(
substratum({ invalidation })
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("config")).define("config", _config);
  main.variable(observer("notebooks")).define("notebooks", _notebooks);
  main.variable(observer("links")).define("links", _links);
  main.variable(observer("accounts")).define("accounts", _accounts);
  main.variable(observer()).define(["md"], _6);
  const child1 = runtime.module(define1);
  main.import("substratum", child1);
  main.variable(observer()).define(["substratum","invalidation"], _8);
  return main;
}
