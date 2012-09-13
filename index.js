var jsdom  = require('jsdom');
var fs     = require('fs');
var jquery = fs.readFileSync("./jquery-1.8.1.min.js").toString();
var config = require('./config');

var oPriceLine = {
  country: "",
  city: "",
  priceText: "",
  price: 0,
  currency: "",
  flightType: "",
  priceType: "",
  pricingConditionUrl: ""
  
}

var getAirFrancePromotionInfo = function(url, retries)
{
	if(retries === 3)
    return;
	else if (retries === undefined)
		retries = 0;

	jsdom.env(
  {
    html: url,
    src: [jquery],
    done: function(errors, window)
    {
      if(errors)
		    return getLinks(url, retries + 1);

		  var $ = window.$;
		  var oldCountry = '';
		  $('div.table-row').each(function()
      {
        var priceLine = Object.create(oPriceLine);
        priceLine.country = $.trim($('div.pays p.textOffre:first', this).html());
        if(priceLine.country == '&nbsp;')
          priceLine.country = oldCountry;
        else
          oldCountry = priceLine.country;
        priceLine.city = $.trim($('div.ville p.textOffre a:first', this).html());
        priceLine.priceText = $.trim($('div.contenuTarifLibelle p.info a:first', this).html());
        priceLine.price = parseFloat($.trim($('div.contenuTarif p.montantTarif a.tarification:first', this).html())).toFixed(2);
        priceLine.currency = $.trim($('div.contenuTarif p.textOffre:not(.montantTarif) a.tarification:first', this).html());
        priceLine.flightType = $.trim($('div.info p.textOffre:first', this).html());
        priceLine.priceType = $.trim($('div.promo p.textOffre:first', this).html());
        if(priceLine.priceType == '&nbsp;')
          priceLine.priceType = '';
        priceLine.pricingConditionUrl = $.trim($('div.contenuTable p.info a.tarification:first', this).attr('href'));;
        console.log(priceLine);
		  });
	  }
	});
}
console.log('Afrique / Océan Indien');
getAirFrancePromotionInfo('http://www.airfrance.fr/cgi-bin/AF/FR/fr/local/promos/FullOffersLandingPageAction.do?zoneGeo=AFR&origine=PAR');
console.log('Amériques');
getAirFrancePromotionInfo('http://www.airfrance.fr/cgi-bin/AF/FR/fr/local/promos/FullOffersLandingPageAction.do?zoneGeo=AME&origine=PAR');
console.log('Asie / Moyen Orient');
getAirFrancePromotionInfo('http://www.airfrance.fr/cgi-bin/AF/FR/fr/local/promos/FullOffersLandingPageAction.do?zoneGeo=ASI&origine=PAR');
console.log('Caraïbes');
getAirFrancePromotionInfo('http://www.airfrance.fr/cgi-bin/AF/FR/fr/local/promos/FullOffersLandingPageAction.do?zoneGeo=CAR&origine=PAR');
console.log('Europe');
getAirFrancePromotionInfo('http://www.airfrance.fr/cgi-bin/AF/FR/fr/local/promos/FullOffersLandingPageAction.do?zoneGeo=EU&origine=PAR');
console.log('France');
getAirFrancePromotionInfo('http://www.airfrance.fr/cgi-bin/AF/FR/fr/local/promos/FullOffersLandingPageAction.do?zoneGeo=FRA&origine=PAR');

