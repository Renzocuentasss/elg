///var urljs = "localhost/elgaenlinea/";

function scroll_to_class(element_class, removed_height) {
	var scroll_to = $(element_class).offset().top - removed_height;
	if($(window).scrollTop() != scroll_to) {
		$('html, body').stop().animate({scrollTop: scroll_to}, 0);
	}
}

function bar_progress(progress_line_object, direction) {
	var number_of_steps = progress_line_object.data('number-of-steps');
	var now_value = progress_line_object.data('now-value');
	var new_value = 0;
	if(direction == 'right') {
		new_value = now_value + ( 100 / number_of_steps );
	}
	else if(direction == 'left') {
		new_value = now_value - ( 100 / number_of_steps );
	}
	progress_line_object.attr('style', 'width: ' + new_value + '%;').data('now-value', new_value);
    progress_line_object.attr('data-now-value',new_value);
}

jQuery(document).ready(function() {
    
    "use strict"
    /* === Preloader === */
    $("#preloader").delay(2000).fadeOut("slow");

    // progress bar
	var progress = $('.f1-progress-line').attr('data-now-value');
    $('.f1-progress-line').css('width', progress +'%');
    /*
        Form
    */
    $('.f1 fieldset:first').fadeIn('slow');
    
    $('.f1 input[type="text"], .f1 input[type="password"], .f1 textarea').on('focus', function() {
    	$(this).removeClass('input-error');
    });
    
    // next step
    $('.btn-next').on('click', function() 
    {
        var Usuario = $('#f1-first-name').val();
        var Identidad = $('#f1-last-name').val();
    	
        if ( Usuario != "" && Identidad != "") 
        {
            var parametros = {};
            parametros.us = Usuario;
            parametros.IDENTIDAD = Identidad;
            var json = JSON.stringify(parametros);
            var UsuarioBase = btoa(json);
            var path = urljs + "session/step_one";

            //console.log(data);
			//GoToCredencial(true);	
			var parent_fieldset = $(this).parents('fieldset');
			var next_step = true;
			// navigation steps / progress steps
			var current_active_step = $(this).parents('.f1').find('.f1-step.active');
			var progress_line = $(this).parents('.f1').find('.f1-progress-line');

            var posting = $.post(path, {data:UsuarioBase});
            posting.done(function(data)
                {
                	if(data.Estado)
                	{
                		// fields validation
						parent_fieldset.find('input[type="text"], input[type="password"], textarea').each(function() 
						{
							if( $(this).val() == "" ) {
								$(this).addClass('input-error');
								next_step = false;
							}
							else {
								$(this).removeClass('input-error');
							}
						});
						// fields validation

						if( next_step ) 
						{
							parent_fieldset.fadeOut(400, function() {
								// change icons
								current_active_step.removeClass('active').addClass('activated').next().addClass('active');
								// progress bar
								bar_progress(progress_line, 'right');
								// show next step
								$(this).next().fadeIn();
								// scroll window to beginning of the form
								scroll_to_class( $('.f1'), 20 );
							});
						}
                	}
                	else
                	{
                		$('#msjAlerta').html(data.Mensaje);
                	}
                    
                });
            posting.fail(function(data, status, xhr)
                {
                    
                });
            posting.always(function(data, status, xhr)
                {
                    
                });
        }
        else
        {
            $('#msjAlerta').html("Ingrese Datos");
        }

    	
    });

$('#btnObtenerToken').on('click', function()
    {
        var Usuario = $('#f1-first-name').val();
        var Identidad = $('#f1-last-name').val();
        var ps = $('#f1-email').val();
        var captcha = $('#txtCaptcha').val();
        var Yes = $('#Yes').val();
        var jsonBase = btoa(ps);
        var parametros = {};
        parametros.us = Usuario;
        parametros.Identidad = Identidad;
        parametros.ps = ps;
        parametros.captcha = captcha;
        var json = JSON.stringify(parametros);
        var UsuarioBase = btoa(json);
        var path = urljs + "session/sessionObtenerToken";
        if(ps == "")
        {
            alert("Ingrese Credencial");
        }
        else if (captcha != Yes) 
        {
            alert("captcha incorrecto");
            //window.location = urljs + "session";
        }
        else
        {
        $('#btnObtenerToken').text('Enviando Token...').prop('disabled', true);
        var posting = $.post(path, {data:jsonBase, user: Usuario, Identidad: Identidad});
        posting.done(function(data) 
            {
                if (data.Estado) 
                {
                    $('#btnObtenerToken').text('Token Enviado...').prop('disabled', true);
                     alert("Token Enviado Satisfactoriamente a su numero Celular! Token Expira en 90 Segundos...");
                    //window.location = urljs + "perfil";
                    //$('#msglog').html('<span class="label label-success">Bienvenido</span>');  
                }else
                {

                    alert(data.Mensaje+"\n Error al enviar TOKEN.");
                    window.location = urljs + "";
                }}
             );
        }  
    });
    

    $('#btnIniciar').on('click', function()
    {
         var Usuario = $('#f1-first-name').val();
        var Identidad = $('#tokenIdTexto').val();
        var ps = $('#f1-email').val();
        var captcha = $('#txtCaptcha').val();
        var Yes = $('#Yes').val();
        var jsonBase = btoa(ps);
        var parametros = {};
        parametros.us = Usuario;
        parametros.Identidad = Identidad;
        parametros.ps = ps;
        parametros.captcha = captcha;
        var json = JSON.stringify(parametros);
        var UsuarioBase = btoa(json);
        var path = urljs + "session/sessionstart";
        
        //var posting = $.post(path, {data:UsuarioBase});

        if(ps == "")
        {
            alert("Ingrese Credencial");
        }
        else if (captcha != Yes) 
        {
            alert("captcha incorrecto");
            //window.location = urljs + "session";
        }
        else if(Identidad =="")
        {
            alert("Debe Ingresar un Token Valido!")
        }
        else
        {
            $('#btnIniciar').text('Verificando...').prop('disabled', true);
            var posting = $.post(path, {data:jsonBase, user: Usuario, Identidad: Identidad});
            posting.done(function(data) 
                {
                    if (data.Estado) 
                    {
                        $('#btnIniciar').text('Bienvenido...').prop('disabled', true);
                        window.location = urljs + "perfil";
                        //$('#msglog').html('<span class="label label-success">Bienvenido</span>');  
                    }
                    else
                    {
                        //window.location = urljs + "session";
                        if (data.CodStatus == 9999) 
                        {
                            alert(data.Mensaje+"\n Necesitas realizar cambio de contraseña, Click en Aceptar.");
                            window.location = urljs + "session?view=1";
                        }
                        $('#btnIniciar').text('Ingresar').prop('disabled', false);
                        //$('#msjAlerta').html();
                        alert(data.Mensaje);
                        $('#msglog').html('<span class="label label-success">'+data.Mensaje+'</span>');  
                    }

                });
                posting.fail(function(data, status, xhr) 
                {
                    //window.location = urljs + "session";
                    alert(data+', status: '+status);
                });
                posting.always(function(data) 
                {
                    setTimeout(() => {
                        $('#btnIniciar').text('Ingresar').prop('disabled', false);
                    }, 5000);

                });
        }

    });

    $('#btnGenerarNuevoCaptcha').on('click', function()
    {
    	var path = urljs + 'session/Nuevocaptcha';
    	var posting = $.post(path, {data:null});
    	posting.done(function(data, status, xhr)
    	{
			$('.valcaptcha').attr('value', data.Var);
			$('.captchaimg').attr('src', data.Url);

            
			
    	});
    	posting.fail(function(data, status, xhr)
    	{
    		console.log(status);
			console.log(xhr);
    	});
    })

    function GoToCredencial(IsTrue) 
    {
        if (IsTrue) 
        {
            var parent_fieldset = $(this).parents('fieldset');
            var next_step = true;
            // navigation steps / progress steps
            var current_active_step = $(this).parents('.f1').find('.f1-step.active');
            var progress_line = $(this).parents('.f1').find('.f1-progress-line');
            
            // fields validation
            parent_fieldset.find('input[type="text"], input[type="password"], textarea').each(function() 
            {
                if( $(this).val() == "" ) {
                    $(this).addClass('input-error');
                    next_step = false;
                }
                else {
                    $(this).removeClass('input-error');
                }
            });
            // fields validation
            
            if( next_step ) 
            {
                parent_fieldset.fadeOut(400, function() {
                    // change icons
                    current_active_step.removeClass('active').addClass('activated').next().addClass('active');
                    // progress bar
                    bar_progress(progress_line, 'right');
                    // show next step
                    $(this).next().fadeIn();
                    // scroll window to beginning of the form
                    scroll_to_class( $('.f1'), 20 );
                });
            }
        }
    }
    
    // previous step
    $('.f1 .btn-previous').on('click', function() {
    	// navigation steps / progress steps
    	$('#f1-first-name').val("");
    	$('#f1-last-name').val("");
        $('#txtCaptcha').val("");
        window.location = urljs;
    	$('#msjAlerta').html("");
    	var current_active_step = $(this).parents('.f1').find('.f1-step.active');
    	var progress_line = $(this).parents('.f1').find('.f1-progress-line');
    	
    	$(this).parents('fieldset').fadeOut(400, function() {
    		// change icons
    		current_active_step.removeClass('active').prev().removeClass('activated').addClass('active');
    		// progress bar
    		bar_progress(progress_line, 'left');
    		// show previous step
    		$(this).prev().fadeIn();
    		// scroll window to beginning of the form
			scroll_to_class( $('.f1'), 20 );
    	});
    });
    
    // submit
    /*$('.f1').on('submit', function(e) {
    	
    	// fields validation
    	$(this).find('input[type="text"], input[type="password"], textarea').each(function() {
    		if( $(this).val() == "" ) {
    			e.preventDefault();
    			$(this).addClass('input-error');
    		}
    		else {
    			$(this).removeClass('input-error');
    		}
    	});
    	// fields validation
    	
    }); */
    

    // Sign up & login 
    $('.registered a.login').on('click',function(){
        $('.login-form').fadeIn(1000);
        $('.registration-form').fadeOut(1);
    });
    $('.new a.Sign-up').on('click',function(){
        $('.registration-form').fadeIn(1000);
        $('.login-form').fadeOut(1);
    });
    
});
