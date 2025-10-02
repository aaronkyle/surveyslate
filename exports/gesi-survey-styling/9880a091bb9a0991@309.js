import define1 from "./e096f8da28ad2268@315.js";

function _1(md){return(
md`# Facilities in Households, Nepal, 2011

Data Source: [Census Nepal, 2011](https://censusnepal.cbs.gov.np/Home/Details?tpid=5&dcid=44c9ea09-db76-4b98-a63a-28bb2f73eabe&tfsid=1)`
)}

function _2(md){return(
md`## Province Wise`
)}

function _byProvince(data){return(
data.byProvince
)}

function _4(Inputs,byProvince){return(
Inputs.table(byProvince)
)}

function _5(md){return(
md`## District Wise`
)}

function _byDistrict(data){return(
data.byDistrict
)}

function _7(Inputs,byDistrict){return(
Inputs.table(byDistrict)
)}

function _8(md){return(
md`## Municipality Wise`
)}

function _byMuncipality(data){return(
data.byLocalLevel
)}

function _10(Inputs,byMuncipality){return(
Inputs.table(byMuncipality)
)}

function _11(md){return(
md`## Municipality Alternate Names

This is a dictionary of names to match names in the
[\`admin_municipalities\` GeoJSON](https://observablehq.com/@adb/nepal-official-spatial-data-on-administrative-divisions#admin_municipalities).
`
)}

function _12(Inputs,alternateMunicipalityNames){return(
Inputs.table(alternateMunicipalityNames)
)}

function _alternateMunicipalityNames(d3){return(
new Map(
  d3.csvParseRows(`Aadarsha Gaunpalika,Adharsha Gaunpalika
Aadarsha Kotwal Gaunpalika,Adarshkotwal Gaunpalika
Aairawati Gaunpalika,Ayirabati Gaunpalika
Aalital Gaunpalika,Alital Gaunpalika
Aanbu Khaireni Gaunpalika,Anbukhaireni Gaunpalika
Aathabisakot Municipality,Aathbiskot Municipality
Aatharai Gaunpalika,Aathrai Gaunpalika
Aatharai Tribeni Gaunpalika,Aathrai Tribeni Gaunpalika
Aathbis Municipality,Aathbis Nagarpalika
Agmisair Krishna Sabaran Gaunpalika,Agnisair Krishna Savaran Gaunpalika
Aiselukharka Gaunpalika,Ainselukharka Gaunpalika
Ajayameru Gaunpalika,Ajaymeru Gaunpalika
Arjun Choupari Gaunpalika,Arjunchaupari Gaunpalika
Aurahi Gaunpalika,Aaurahi Gaunpalika
Badi Kedar Gaunpalika,Badikedar Gaunpalika
Bagachour Municipality,Bagchaur Municipality
Baganaskali Gaunpalika,Bagnaskali Gaunpalika
Bahrabise Municipality,Barhabise Municipality
Bahragaun Muktikshetra Gaunpalika,Barhagaun Muktikhsetra Gaunpalika
Bahudarmai Municipality,Bahudaramai Municipality
Baitedhar Gaunpalika,Baiteshwor Gaunpalika
Balawa Municipality,Balwa Municipality
Balephi Gaunpalika,Balefi Gaunpalika
Banagad Kupinde Municipality,Bangad Kupinde Municipality
Bangalachuli Gaunpalika,Banglachuli Gaunpalika
Bannigadhi Jayagadh Gaunpalika,Bannigadi Jayagadh Gaunpalika
Banphikot Gaunpalika,Banfikot Gaunpalika
Bansgadhi Municipality,Bansagadhi Municipality
Baraha Pokhari Gaunpalika,Barahapokhari Gaunpalika
Barahatal Gaunpalika,Barahtal Gaunpalika
Bardagoriya Gaunpalika,Bardagariya Gaunpalika
Bareng Gaunpalika,Woreng Gaunpalika
Barhadashi Gaunpalika,Garhadashi Gaunpalika
Belouri Municipality,Belauri Municipality
Bensi Shahar Municipality,Besishahar Municipality
Bhageshwor Gaunpalika,Bhageshwar Gaunpalika
Bhoome Gaunpalika,Bhume Gaunpalika
Binayi Tribeni Gaunpalika,Binayee Tribeni Gaunpalika
Birgunj Metropolitian City,Belwa Gaunpalika
Bitthadchir Gaunpalika,Bithadchir Gaunpalika
Bogatan Gaunpalika,Bogtan Gaunpalika
Boudhimai Municipality,Baudhimai Municipality
Brahmapuri Gaunpalika,Bramhapuri Gaunpalika
Brindaban Municipality,Birndaban Municipality
Budhanilkhantha Municipality,Budhanilakantha Municipality
Chainapur Municipality,Chainpur Municipality
Chaudandigadhi Municipality,Chaudandigadi Municipality
Chauri Deurali Gaunpalika,Chaurideurali Gaunpalika
Chhabis Pathibhara Gaunpalika,Chabispathivera Gaunpalika
Chhatradev Gaunpalika,Chattradev Gaunpalika
Chhatrakot Gaunpalika,Chatrakot Gaunpalika
Chhatreshwori Gaunpalika,Chhatreswari Gaunpalika
Chishankhu Gadhi Gaunpalika,Chisankhugadhi Gaunpalika
Choutara Sangachowkgadhi Municipality,Chautara SangachokGadhi Municipality
Chumanubri Gaunpalika,Chum Nubri Gaunpalika
Dakneshwori Municipality,Dakneshwari Municipality
Dasharathchand Municipality,Dasharathchanda Municipality
Dewahi Gonahi Municipality,Dewahhi Gonahi Municipality
Dewangunj Gaunpalika,Dewanganj Gaunpalika
Dhanakaul Gaunpalika,Dhankaul Gaunpalika
Dhanapalthan Gaunpalika,Dhanpalthan Gaunpalika
Dhanushadham Municipality,Dhanusadham Municipality
Dhudha Koushika Gaunpalika,Thulung Dudhkoshi Gaunpalika
Dhudhakoshi Gaunpalika,Dudhkoshi Gaunpalika
Dhunibenshi Municipality,Dhunibesi Municipality
Dipayal Silgadhi Municipality,Dipayal Silgadi Municipality
Dogada Kedar Gaunpalika,Dogadakedar Gaunpalika
Doramba Gaunpalika,Doraamba Gaunpalika
Dudhapokhari Gaunpalika,Dudhpokhari Gaunpalika
Duhun Gaunpalika,Dunhu Gaunpalika
Dupcheshwor Gaunpalika,Dupcheshwar Gaunpalika
Durga Bhagawati Gaunpalika,Durga Bhagwati Gaunpalika
Ekadara Gaunpalika,Ekdanra Gaunpalika
Fakfokathum Gaunpalika,Fakphokthum Gaunpalika
Falgunanda Gaunpalika,Galgunanda Gaunpalika
Gadhawa Gaunpalika,Gadwa Gaunpalika
Galchhi Gaunpalika,Galchi Gaunpalika
Ganga Jamuna Gaunpalika,Gangajamuna Gaunpalika
Ganyapdhura Gaunpalika,Ganayapdhura Gaunpalika
Gauradaha Municipality,Gauradhaha Municipality
Gharpajhong Gaunpalika,Gharapjhong Gaunpalika
Godaita Municipality,Gaudeta Municipality
Godawari Municipality,Gadawari Municipality
Gulmi Durbar Gaunpaika,Gulmidarbar Gaunpaika
Hansapur Municipality,Hansapur Kathapulla Municipality
Hanumannagar Kankalini Municipality,Hanumannagar Kankalan Municipality
Hariharpurgaghi Gaunpalika,Hariharpurgadhi Gaunpalika
Hilihan Gaunpalika,Hilihang Gaunpalika
Ichchha Kamana Gaunpalika,Ichchhyakamana Gaunpalika
Illam Municipality,Ilam Municipality
Indrasarowar Gaunpalika,Indrasarawor Gaunpalika
Indrawoti Gaunpalika,Indrawati Gaunpalika
Jaleshwor Municipality,Jaleswor Municipality
Janak Nandini Gaunpalika,Janaknandani Gaunpalika
Jante Dhunga Gaunpalika,Jantedhunga Gaunpalika
Jayaprithbi Municipality,JayaPrithivi Municipality
Jhimaruk Gaunpalika,Jhimruk Gaunpalika
K.I. Singh Gaunpalika,K I Singh Gaunpalika
Kabilashi Municipality,Kabilasi Municipality
Kachanakawal Gaunpalika,Kachankawal Gaunpalika
Kageshwori Manahara Municipality,Kageshwori Manahora Municipality
Kalaiya Sub-Metropolitian City,Kaliya Sub-Metropolitian City
Kaligandaki Gaunpalika,Kaligandagi Gaunpalika
Kalinchowk Gaunpalika,Kalinchok Gaunpalika
Kamal bazar Municipality,Kamalbazar Municipality
Kamala Municipality,Kamala Siddhidatri Gaunpalika
Kanaka Sundari Gaun Palika,Kanakasundari Gaunpalika
Kapilbastu Municipality,Kapilvastu Municipality
Kedarsyun Gaunpalika,Kedarseu Gaunpalika
Khalsa Chhintang Sahidbhumi Gaunpalika,Shahidbhumi Gaunpalika
Khandabari Municipality,Khandbari Municipality
Khandadevi Gaunpalika,Khadadevi Gaunpalika
Khaptad Chhanna Gaunpalika,Khaptadchhanna Gaunpalika
Khiji Demba Gaunpalika,Khijidemba Gaunpalika
Khumbu Pasanglhamu Gaunpalika,Khumbupasanglahmu Gaunpalika
Kwhola Sothar Gaunpalika,Kwholasothar Gaunpalika
Laligurans Municipality,Laliguras Municipality
Lamahi Municipality,Lamhi Municipality
Lamki Chuha Municipality,Lamkichuha Nagarpalika
Laxminiya Gaunpalika,Lakshminiya Gaunpalika
Laxmipur Patari Gaunpalika,Laxmi Patari Gaunpalika
Lekabeshi Municipality,Lekbeshi Municipality
Likhu Gaunpalika,Likhu Tamakoshi Gaunpalika
Likhu Pike Gaunpalika,Likhupike Gaunpalika
Lisankhu Pakhar Gaunpalika,Lisangkhu Pakhar Gaunpalika
Madhya Bindu Municipality,Madhyabindu Municipality
Madhya Nepal Municipality,MadhyaNepal Municipality
Maharajganj Municipality,Maharajgunj Municipality
Mai Jogmai Gaunpalika,Maijogmai Gaunpalika
Makawanpurgadhi Gaunpalika,Makwanpurgadhi Gaunpalika
Manara Shisawa Municipality,Manra Siswa Municipality
Mandan Deupur Municipality,Mandandeupur Municipality
Mandavi Gaunpalika,Mandawi Gaunpalika
Marshyangdi Gaunpalika,Marsyangdi Gaunpalika
Melanchi Municipality,Melamchi Municipality
Menchhayayem Gaunpalika,Menchayam Gaunpalika
Miklajung Gaunpalika,Miklajunga Gaunpalika
Mugumakarmarog Gaunpalika,Mugum Karmarong Gaunpalika
Mukhiyapatti Musaharmiya Gaunpalika,Mukhiyapatti Musarmiya Gaunpalika
Naraha Gaunpalika,Narha Gaunpalika
Naraphu Gaunpalika,Narphu Gaunpalika
Necha Salyan Gaunpalika,Nechasalyan Gaunpalika
Nijagadh Municipality,Nijgadh Municipality
Nilkhantha Municipality,Nilakantha Municipality
Om Satiya Gaunpalika,Omsatiya Gaunpalika
Pachal Jharana Gaunpalika,Pachaljharana Gaunpalika
Paiyu Gaunpalika,Painyu Gaunpalika
Pakaha Mainpur Gaunpalika,Pakahamainpur Gaunpalika
Panchapuri Municipality,Panchpuri Municipality
Panchdebal Binayak Municipality,Panchadewal Binayak Municipality
Pancheshwor Gaunpalika,Pancheshwar Gaunpalika
Pandab Gufa Gaunpalika,Pandav Gupha Gaunpalika
Parawanipur Gaunpalika,Parwanipur Gaunpalika
Parbatikunda Gaunpalika,Parbati Kunda Gaunpalika
Patam Municipality,Patan Municipality
Paterwa Sugauli Gaunpalika,Paterwasugauli Gaunpalika
Pathari Shanishchare Municipality,Patahrishanishchare Municipality
Pauwa Dunma Gaunpalika,Pauwadungma Gaunpalika
Phaktanlung Gaunpalika,Phaktanglung Gaunpalika
Phalebas Municipality,Falebas Municipality
Pipara Gaunpalika,Pipra Gaunpalika
Pratapapur Gaunpalika,Pratappur Gaunpalika
Puchaundi Municipality,Purchaudi Municipality
Purbichouki Gaunpalika,Purbichauki Gaunpalika
Putha Uttanganga Gaunpalika,Putha Uttarganga Gaunpalika
Rainadevi Chhahara Gaunpalika,Rainadevi Chahara Gaunpalika
Raksirang Gaunpalika,Rakshirang Gaunpalika
Ram Gopalpur Municipality,Ramgopalpur Municipality
Rapti Sonari Gaunpalika,Raptisonari Gaunpalika
Rhishing Gaunpalika,Rhising Gaunpalika
Salpa Silichho Gaunpalika,Salpasilichho Gaunpalika
Sangurigadhi Gaunpalika,Sagurigadhi Gaunpalika
Sanibheri Gaunpalika,Sani Bheri Gaunpalika
Satyawoti Gaunpalika,Satyawati Gaunpalika
Shahid Lakhan Gaunpalika,Sahid Lakhan Gaunpalika
Shahidnagar Municipality,Sahidnagar Municipality
Shailung Gaunpalika,Sailung Gaunpalika
Sharada Municipality,Sarada Municipality
Shey Phoksundo Gaunpalika,She Foksundo Gaunpalika
Shitaganga Municipality,Sitganga Municipality
Shivalaya Gaunpalika,Shiwalaya Gaunpalika
Shivaraj Municipality,Shivraj Municipality
Shivasatakshi Municipality,Shivasataxi Municipality
Suddhodhan Gaunpalika,Sudhdhodhan Gaunpalika
Shuklaphanta Municipality,Suklaphata Municipality
Simroungadh Municipality,Simraungadh Municipality
Siranchowk Gaunpalika,Siranchok Gaunpalika
Sirijanga Gaunpalika,Sirijangha Gaunpalika
Solu Dhudhakunda Municipality,Solududhakunda Municipality
Subarna Gaunpalika,Suwarna Gaunpalika
Subarnabati Gaunpalika,Suwarnabati Gaunpalika
Sunawal Municipality,Sunwal Municipality
Sundarharaicha Municipality,Sundarharicha Municipality
Sunkoshi Gaunpalika,Sukoshi Gaunpalika
Sunwarshi Municipality,Sunawarshi Municipality
Susta Gaunpalika,Tribenisusta Gaunpalika
Tarakeshwor Gaunpalika,Tarkeshwar Gaunpalika
Thori Gaunpalika,Subarnapur Gaunpalika
Thulibheri Municipality,Thuli Bheri Municipality
Tilagupha Municipality,Tilagufa Municipality
Tilottama Municipality,Tillotama Municipality
Tribeni Gaunpalika,Triveni Gaunpalika
Turmakhand Gaunpalika,Turmakhad Gaunpalika
Tyamke Maiyum Gaunpalika,Tyamkemaiyung Gaunpalika
Urlabari Municipality,Uralabari Municipality
Walling Municipality,Waling Municipality
Yangbarak Gaunpalika,Pathibhara Yangwarak Gaunpalika
Yasodhara Gaunpalika,Yashodhara Gaunpalika
Bhokraha Gaunpalika,Bhokraha Narsingh Gaunpalika
Kepilasgadhi Gaunpalika,Kepilasagadhi Gaunpalika
Lamidanda Gaunpalika,Rawa Besi Gaunpalika
Balan-Bihul Gaunpalika,Balan Bihul Gaunpalika
Mahadewa Gaunpalika,Mahadeva Gaunpalika
Sakhuwa Nankarkatti Gaunpalika,Sakhuwanankarkatti Gaunpalika
Ghyanglekha Gaunpalika,Ghanglekh Gaunpalika
Khaniyabas Gaunpalika,Khaniyabash Gaunpalika
Netrawati Gaunpalika,Netrawati Dabjong Gaunpalika
Tripurasundari Gaunpalika,Tripura Sundari Gaunpalika
Yamunamai Gaunpalika,Yemunamai Gaunpalika
Sakhuwa Prasauni Gaunpalika,SakhuwaPrasauni Gaunpalika
Neshang Gaunpalika,Neshyang Gaunpalika
Dhawalagiri Gaunpalika,Dhaulagiri Gaunpalika
Kathekhola Gaunpalika,Kanthekhola Gaunpalika
Tamankhola Gaunpalika,Taman Khola Gaunpalika
Tarakhola Gaunpalika,Tara Khola Gaunpalika
Palhinandan Gaunpalika,Palhi Nandan Gaunpalika
Lumbini Sanskritik Municipality,Lumbini Sanskritik Development Area Municipality
Bhumikasthan Municipality,Bhumekasthan Municipality
Sworgadwari Municipality,Sworgadwary Municipality
Runtigadhi Gaunpalika,Runtigadi Gaunpalika
Kumakh Malika Gaunpalika,Kumakhmalika Gaunpalika
Janaki Gaunpalika,Janki Gaunpalika
Nepalganj Sub-Metropolitian City,Nepalgunj Upamahanagarpalika
Malikarjun Gaunpalika,Malikaarjun Gaunpalika
Patarasi Gaunpalika,Patrasi Gaunpalika
`)
)
)}

function _14(md){return(
md`---`
)}

function _data(localHouseholdLevelSheet,translateKeys)
{
  let data = localHouseholdLevelSheet.sheet("GP_Hhld_Table09", {
    range: "A3:"
  });

  let [_0, headers, _1, ...raw] = data;

  raw = raw.filter((o) => Object.keys(o).length !== 0);

  headers = Object.entries(headers).reduce((acc, [k, v]) => {
    return { ...acc, [k]: v.replace(/\s+/g, " ").replace("- ", "").trim() };
  }, {});

  delete headers["A"];
  delete headers["B"];
  delete headers["C"];
  delete headers["D"];

  const byProvince = [];
  const byDistrict = [];
  const byLocalLevel = [];
  let currentProvince;
  let currentDistrict;
  let distObj;

  const headersMap = new Map(Object.entries(headers));

  raw.forEach((r) => {
    const { A, B, C, D, ...rest } = r;
    // map province
    if (A) {
      currentProvince = A;
      byProvince.push({
        Province: currentProvince,
        ...translateKeys(rest, headersMap)
      });

      // push previous district data
      if (distObj) {
        byDistrict.push(distObj);
        distObj = undefined;
      }
    } else if (B) {
      currentDistrict = B;
    } else if (D === "Total") {
      byDistrict.push({
        Province: currentProvince,
        District: currentDistrict,
        ...translateKeys(rest, headersMap)
      });
    } else {
      byLocalLevel.push({
        Province: currentProvince,
        District: currentDistrict,
        Municipality: D,
        ...translateKeys(rest, headersMap)
      });
    }
  });

  return { byProvince, byDistrict, byLocalLevel, raw, headers };
}


function _localHouseholdLevelSheet(FileAttachment){return(
FileAttachment("Local-Household-Level.xlsx").xlsx()
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["Local-Household-Level.xlsx", {url: new URL("./files/d15f3aa38692d733a462a4a56b3f74e17ab8f661b6955263fdceb2454117c13d5f05699deb06fb87508b9ee842c17d35a910a94771690834e22259b328c16b79.xlsx", import.meta.url), mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["md"], _2);
  main.variable(observer("byProvince")).define("byProvince", ["data"], _byProvince);
  main.variable(observer()).define(["Inputs","byProvince"], _4);
  main.variable(observer()).define(["md"], _5);
  main.variable(observer("byDistrict")).define("byDistrict", ["data"], _byDistrict);
  main.variable(observer()).define(["Inputs","byDistrict"], _7);
  main.variable(observer()).define(["md"], _8);
  main.variable(observer("byMuncipality")).define("byMuncipality", ["data"], _byMuncipality);
  main.variable(observer()).define(["Inputs","byMuncipality"], _10);
  main.variable(observer()).define(["md"], _11);
  main.variable(observer()).define(["Inputs","alternateMunicipalityNames"], _12);
  main.variable(observer("alternateMunicipalityNames")).define("alternateMunicipalityNames", ["d3"], _alternateMunicipalityNames);
  main.variable(observer()).define(["md"], _14);
  main.variable(observer("data")).define("data", ["localHouseholdLevelSheet","translateKeys"], _data);
  main.variable(observer("localHouseholdLevelSheet")).define("localHouseholdLevelSheet", ["FileAttachment"], _localHouseholdLevelSheet);
  const child1 = runtime.module(define1);
  main.import("translateKeys", child1);
  return main;
}
