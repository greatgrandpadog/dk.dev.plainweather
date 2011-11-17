// Plainweather.js
// Main javascript file for Plainweather app.

function ToggleHeaderInfo()
{    
    var common_duration = 250;
    var common_transition =  Fx.Transitions.linear.easeInOut;
    
    var info_trans = new Fx.Elements([$('hbup'),$('hbbgwrap'), $('hbl'),$('hbr'), $('contentbase')],{duration:common_duration, transition: common_transition});

    var info_height = $('hbup').getStyle('height').replace('px','');
    var info_height_num = parseInt(info_height);
    var info_top = $('hbup').getStyle('top');
    
    if (info_top == '0px')
    {
        info_trans.start(
        {
            '0': {'top': ['0px','-' + info_height + 'px']},
            '1': {'top': [info_height + 'px','0px']},
            '2': {'top': [(info_height_num + 5).toString() + 'px','5px']},
            '3': {'top': [(info_height_num + 5).toString() + 'px','5px']},
            '4': {'top': [(info_height_num + 20).toString() + 'px','20px']}
        });
    }
    else
    {
        info_trans.start(
        {
            '0': {'top': ['-' + info_height + 'px','0px']},
            '1': {'top': ['0px',info_height + 'px']},
            '2': {'top': ['5px',(info_height_num + 5).toString() + 'px']},
            '3': {'top': ['5px',(info_height_num + 5).toString() + 'px']},
            '4': {'top': ['20px',(info_height_num + 20).toString() + 'px']}            
        });    
    }
}

function TranslateIconFileName(ini_icon_file_name, is_for_forecast)
{
    var translated_icon_file_name = ini_icon_file_name.replace('/ig/images/weather','').replace('gif','png');
    
    translated_icon_file_name = translated_icon_file_name.replace('/sunny','/sun');
    translated_icon_file_name = translated_icon_file_name.replace('/flurries','/snow');
    translated_icon_file_name = translated_icon_file_name.replace('/chance_of_snow','/snow');
    translated_icon_file_name = translated_icon_file_name.replace('/mostly_cloudy','/partly_cloudy');
    translated_icon_file_name = translated_icon_file_name.replace('/mostly_sunny','/partly_cloudy');
    translated_icon_file_name = translated_icon_file_name.replace('/thunderstorm','/tstorms');
    translated_icon_file_name = translated_icon_file_name.replace('/mist','/rain');
    translated_icon_file_name = translated_icon_file_name.replace('/haze','/fog');
    translated_icon_file_name = translated_icon_file_name.replace('/chance_of_storm','/rain');
    translated_icon_file_name = translated_icon_file_name.replace('/chance_of_rain','/light_rain');
    
    if (is_for_forecast)
    {
        return "http://g0.gstatic.com/onebox/weather/35"+ translated_icon_file_name;   
    }
    else
    {
        return "http://g0.gstatic.com/onebox/weather/60"+ translated_icon_file_name;        
    } 
}

function SetSrcForImage(element, src)
{
  var img = new Image();
  img.onload = function()
  {
    element.set('src', src);
  };
  img.onerror = function()
  {
    element.set('src', '/static/images/image_not_found.png');
  };

  img.src = src;
}


function UpdateWeatherInfo(location, is_form_submit, responseXML)
{
    var update_recent_places = false;
    var warn_not_found = true;
    
    // This seems to get over a Chrome problem that says responseXML has no method 'getElements'.
    if(typeOf(responseXML) != 'document')
    {
        responseXML = responseXML.documentElement; 
    }
    
    var weather_wrap = $$('.weatherwrapinactive').pick();
    var weather_wrap_old = $$('.weatherwrapactive .weatherplace').pick();
    var ini_place = weather_wrap_old.get('html');   
    var place_name = 'Somewhere';
    
    responseXML.getElements('forecast_information').each(function(item)
    {
        item.getElements('city').each(function(city_data)
        {
            place_name = city_data.get('data');
            weather_wrap.getElements('.weatherplace').each(function(place)
            {
                warn_not_found = false;
                place.set('html', place_name);
                if (ini_place != place_name)
                {
                    update_recent_places = true;
                }
            })
        });
    });
    
    // Apply current conditions.
    responseXML.getElements('current_conditions').each(function(item)
    {
        item.getElements('condition').each(function(condition)
        {
            var current_condition = condition.get('data');
            weather_wrap.getElements('.currentweathercondition').each(function(element)
            {
               element.set('html', current_condition);
            });
        });
        
        item.getElements('temp_f').each(function(temp_f)
        {
            var current_temp = temp_f.get('data');
            weather_wrap.getElements('.currentweathertemperature').each(function(element)
            {
               element.set('html', current_temp);
            });
        });
        
        item.getElements('wind_condition').each(function(temp_f)
        {
            var current_temp = temp_f.get('data');
            weather_wrap.getElements('.currentweatherwind_condition').each(function(element)
            {
               element.set('html', current_temp);
            });
        });
        
        item.getElements('humidity').each(function(temp_f)
        {
            var current_temp = temp_f.get('data');
            weather_wrap.getElements('.currentweatherhumidity').each(function(element)
            {
               element.set('html', current_temp);
            });
        });

        item.getElements('icon').each(function(icon_element)
        {
            var current_icon = icon_element.get('data');
            weather_wrap.getElements('.currentweathericon').each(function(element)
            {
               SetSrcForImage(element,  TranslateIconFileName(current_icon, false));
            });
        });                     
    });
    
    // Apply forecast info.
    var day_val = 0; 
    responseXML.getElements('forecast_conditions').each(function(item)
    {
        day_val += 1;
        
        var day_str = day_val.toString();
        
        item.getElements('day_of_week').each(function(condition)
        {
            var day_of_weak = condition.get('data');
            weather_wrap.getElements('.forecasetday_of_week' + day_str).each(function(element)
            {
               element.set('html', day_of_weak);
            });
        });
        
        item.getElements('low').each(function(xml_element)
        {
            var xml_data = xml_element.get('data');
            weather_wrap.getElements('.forecastlow' + day_str).each(function(element)
            {
               element.set('html', xml_data);
            });
        });
        
        item.getElements('high').each(function(xml_element)
        {
            var xml_data = xml_element.get('data');
            weather_wrap.getElements('.forecasthigh' + day_str).each(function(element)
            {
               element.set('html', xml_data);
            });
        });
        
        item.getElements('icon').each(function(xml_element)
        {
            var xml_data = xml_element.get('data');
            weather_wrap.getElements('.forecasticon' + day_str).each(function(element)
            {
               SetSrcForImage(element,  TranslateIconFileName(xml_data, false));
            });
        });
        
        item.getElements('condition').each(function(xml_element)
        {
            var xml_data = xml_element.get('data');
            weather_wrap.getElements('.forecasticon' + day_str).each(function(element)
            {
               element.set('title', xml_data);
               element.set('alt', xml_data);
            });
        });
    });
    
    if (update_recent_places)
    {
        UpdateRecentPlaces();
    }
    
    if (!warn_not_found)
    {
        weather_wrap.setStyle('background-color',GetBGColorForLocation(place_name, false, true));
        ToggleWeatherInfo();
    }
    
    if (warn_not_found && is_form_submit)
    {
        var weather_location = $('weather-location');
        weather_location.removeClass('weather-location-normal');
        weather_location.addClass('weather-location-error');                
    }
}


function GetWeatherForLocation(location, is_form_submit)
{ 
    var req = new Request({
        url: '/getweather',
        method: 'get',
        data: { 'location' : location },
        onSuccess: function(responseText, responseXML)
        {
            UpdateWeatherInfo(location, is_form_submit, responseXML);
        }
    }).send();    
}

function ClearAnyErrorCondition(event)
{
    if (this.hasClass('weather-location-error'))
    {
        this.addClass('weather-location-normal');
        this.removeClass('weather-location-error');
    }     
}

function OnGetWeatherFormSubmit(event)
{
    event.stop();
    var location =  $('weather-location').value;
    GetWeatherForLocation(location, true);   
}

function RegisterRecentPlace(recent_place)
{
    recent_place.setStyle('background-color', GetBGColorForLocation(recent_place.get('html'), false, false));
    
    recent_place.addEvent('click', function()
    {
        GetWeatherForLocation(this.get('html'), false);
    });
    
    recent_place.addEvent("mouseenter", function(event)
    {
        this.setStyle('background-color', GetBGColorForLocation(this.get('html'), true, false));
         this.setStyle('cursor','pointer');       
    });
    
    recent_place.addEvent("mouseleave", function(event)
    {
        this.setStyle('background-color', GetBGColorForLocation(this.get('html'), false, false));
        this.setStyle('cursor','auto');   
    });    
}

function RegisterRecentPlaces()
{
    $$('.recentplace').each(function(recentplace)
    {
        RegisterRecentPlace(recentplace);
    });    
}

function ToggleRecentPlacesLists()
{    
    var common_duration = 50;
    var common_transition =  Fx.Transitions.linear.easeInOut;
    
    var recent_places_active = $$('.recentcontentactive').pick();
    var recent_places_inactive = $$('.recentcontentinactive').pick();
    
    var active_opacity = recent_places_active.getStyle('opacity');
    var inactive_opacity = recent_places_inactive.getStyle('opacity');
    
    var info_trans = new Fx.Elements([recent_places_active, recent_places_inactive],
    {
        duration:common_duration, transition: common_transition,
        onComplete: function()
        {
            recent_places_active.removeClass('recentcontentactive');
            recent_places_active.addClass('recentcontentinactive');
            recent_places_inactive.removeClass('recentcontentinactive');
            recent_places_inactive.addClass('recentcontentactive');
            
            recent_places_active.getChildren().each(function(child, index)
            {
                child.dispose();      
            })
        }
    });

    info_trans.start(
    {
        '0': {'opacity': [active_opacity,'0']},
        '1': {'opacity': [inactive_opacity,'1']}
    });
}

function ToggleWeatherInfo()
{    
    var common_duration = 500;
    var common_transition =  Fx.Transitions.linear.easeInOut;
    
    var weather_info_active = $$('.weatherwrapactive').pick();
    var weather_info_inactive = $$('.weatherwrapinactive').pick();
    
    var active_opacity = weather_info_active.getStyle('opacity');
    var inactive_opacity = weather_info_inactive.getStyle('opacity');
    
    var active_height = weather_info_active.getStyle('height');
    var active_width_num = parseInt(weather_info_active.getStyle('width'));
    weather_info_inactive.setStyle('opacity','0');
    weather_info_inactive.setStyle('display','block');
    weather_info_inactive.setStyle('left', (-active_width_num - 40).toString());
    weather_info_active.setStyle('z-index','900');
    weather_info_inactive.setStyle('z-index','1000');
    
    var info_trans = new Fx.Elements([weather_info_active, weather_info_inactive],
    {
        duration:common_duration, transition: common_transition,
        onComplete: function()
        {
            weather_info_active.removeClass('weatherwrapactive');
            weather_info_active.addClass('weatherwrapinactive');
            weather_info_inactive.removeClass('weatherwrapinactive');
            weather_info_inactive.addClass('weatherwrapactive');    
        }
    });

    info_trans.start(
    {
        '0': {'opacity': [active_opacity,'0.0'], 'left' : ['0', (active_width_num + 40).toString()]},
        '1': {'opacity': ['0','1'], 'left': [(-active_width_num - 40).toString(), '0']}
    });
}


function GetBGColorForLocation(location, is_for_hover, is_for_weather_info)
{
    var hue = 0;
    if (location.length > 0)
    {   
        for (i = 0; i < location.length; i++)
        {
            var char_val =  location.charCodeAt(i)
            hue +=  char_val * char_val * char_val;
        }
        hue = hue % 360;
    }
    //var saturation = 15;
    var saturation = 25;
    //var brightness = 45;
    var brightness = 40;
    
    if (is_for_hover)
    {
        brightness -= 10;
    }
    
    if (is_for_weather_info)
    {
        brightness += 10;
    }
    
    var bg_color = $HSB(hue, saturation, brightness);
    
    return(bg_color);
}

function UpdateRecentPlaces()
{
    var jsonRequest = new Request.JSON(
    {   url: "/getlocations",
        method: 'get', 
        onSuccess: function(data)
        {        
            var recent_places_active = $$('.recentcontentactive').pick()
            var recent_places_inactive = $$('.recentcontentinactive').pick()
            
            recent_places_inactive.setStyle('opacity',0);
           
            data.each(function(location, index)
            {
                recent_place = new Element('div',{class: "recentplace",text: location}).inject(recent_places_inactive);  
                RegisterRecentPlace(recent_place);
            });
                       
            ToggleRecentPlacesLists();         
        }
    }).send();    
}

window.addEvent('domready', function()
{       
    $('hbbgwrap').addEvent('click', ToggleHeaderInfo);
    
    $('weather-request-form').addEvent('submit', OnGetWeatherFormSubmit);
    
    $("weather-location").addEvent("keydown", ClearAnyErrorCondition);
    
    RegisterRecentPlaces();
});


