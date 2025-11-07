# Survey Slate

<div class="fl pa1 pa2-ns pt5-ns bg-white">

  <div id="overview-d61b69e3" class="observablehq"><div><h2 id="overview">Overview</h2>
<p>Survey Slate is a software application designed for those wishing to create one or several survey instances and to issues these surveys to specific respondents or respondent groups flexibly and securely.</p>
<p>Survey Slate does not offer templates or impose branding.  Survey Slate expects that users will want full capacity to customize surveys. Our application aims to facilitate the development process by offering an open architecture that can easily accommodate new components, business logic, etc. </p>
<p>Survey Slate is <a href="https://observablehq.com/collection/@categorise/survey-slate">written and shared</a> on <a href="https://observablehq.com">Observable</a> and deployed to <a href="https://aws.amazon.com/">Amazon Web Services</a>.</p></div></div>
  <div id="title_core_application-d61b69e3" class="observablehq"><div><h2 id="core-application-notebooks">Core Application Notebooks</h2>
<p>Three notebooks comprise the main entry points for the different types of system users:</p>
<table>
<thead>
<tr>
<th>Notebook</th>
<th>Audience</th>
<th>Purpose</th>
</tr>
</thead>
<tbody>
<tr>
<td><a href="https://observablehq.com/@categorise/opensurvey?collection=@categorise/gesi-survey">Filler</a></td>
<td>End Users / Those Answering Questions</td>
<td>Provides a view of the survey to be completed.  Access is to survey fillers by way of authorized links.</td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<td><a href="https://observablehq.com/@categorise/survey-designer?collection=@categorise/gesi-survey">Designer</a></td>
<td>Survey Creators /  Those asking questions</td>
<td>Provides an interface to create and edit survey content.</td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<td><a href="https://observablehq.com/@categorise/survey-admin?collection=@categorise/gesi-survey">Admin</a></td>
<td>Technical Owners / IT Administrators</td>
<td>Provides utilities for survey &amp; user management, including definition of permissions / access controls and a means of deploying created surveys to CloudFront.</td>
<td></td>
<td></td>
</tr>
</tbody>
</table>
<p>Each application notebook can be accessed from the Observablehq domain, however the best way to view each page is through AWS S3/CloudFront, as doing so avoids potential style conflicts.  Once deployed, each survey application is can be accessed and used without a dependency on Observable servers.</p></div></div>
  <div id="customization-d61b69e3" class="observablehq"><div><h2 id="application-customizations-extension-notebooks">Application Customizations &amp; Extension Notebooks</h2>
<p>To extend and adapt application functionality and to customize application services programmatically, we utilize two additional notebooks:</p>
<table>
<thead>
<tr>
<th>Notebook</th>
<th>Purpose </th>
</tr>
</thead>
<tbody>
<tr>
<td><a href="https://observablehq.com/@categorise/survey-components">Components</a></td>
<td>Survey component library and global configuration</td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<td><a href="https://observablehq.com/@categorise/gesi-styling">Styling</a></td>
<td>Page layout and CSS for presenting a survey</td>
</tr>
</tbody>
</table></div></div>
  <div id="cloud_architecture-d61b69e3" class="observablehq"><div><h2 id="cloud-hosting-architecture">Cloud Hosting Architecture</h2>
<p>Survey Slate uses AWS application hosting, data storage and user management. Service components are as follows:</p>
<table>
<thead>
<tr>
<th>AWS Service</th>
<th>Purpose </th>
</tr>
</thead>
<tbody>
<tr>
<td><a href="https://us-east-2.console.aws.amazon.com/console/home?region=us-east-2">S3</a></td>
<td>Cloud file storage. Separate buckets are used for surveys, responses and configuration.</td>
</tr>
<tr>
<td><a href="https://console.aws.amazon.com/iam/home?region=us-east-2">IAM</a></td>
<td>User management and access policies.</td>
</tr>
<tr>
<td><a href="https://console.aws.amazon.com/cloudfront/v3/home?region=us-east-2">Cloud Front</a></td>
<td>Content delivery (for application serving).</td>
</tr>
</tbody>
</table>
<p>The design concept aims for Cloud simplicity:</p>
<ul>
<li>There is no database, only files and folder in S3 buckets which can be manipulated directly</li>
<li>There are no deployed compute resources.</li>
<li>Authorization is achieved with IAM resource policies on resource tags.</li>
</ul></div></div>
  <div id="getting_started-d61b69e3" class="observablehq"><div><h2 id="get-started-with-survey-slate">Get Started With Survey Slate</h2>
<p>To get started with Survey Slate, check out our <a href="https://observablehq.com/@categorise/surveyslate-docs">Technical Overview</a>.</p></div></div>



</div>