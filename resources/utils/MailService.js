//--------------------------------------------------------------------------
// Public class MailService
//--------------------------------------------------------------------------

/**
 *  Controls the page-layers.
 *
 *  @version    1.0
 *  @copyright  Copyright (c) 2017-2022.
 *  @license    Creative Commons (BY-NC-SA) 3.0
 *  @since      Nov 15, 2017
 *  @author     Samwel Munga <samwelmunga@hotmail.se>
 * 
 */
  

se.soma.utils.MailService = (function() {

        
    //----------------------------------------------------------------------
    // Strict mode
    //----------------------------------------------------------------------

    "use strict";

        
    //----------------------------------------------------------------------
    // Private scope
    //----------------------------------------------------------------------

    var m_this = this, captcha, answer, alertbox = null, savedForm;

    function validate() {
                
        alertbox = getAlert();

        if(!savedForm.email.value) return alertbox.alert('Vänligen ange din e-post adress.');
        
        alertbox.callback = m_this.verify;

        captcha = '<input type="number" id="captcha">';

        alertbox.message  = '<p>Vad är ' + generateCaptcha() + '?</p>' + captcha;

        alertbox.alert();

    }

    function getAlert() {
        
        if(alertbox != null) alertbox.close();

        return new Alertbox();
    }

    function alert( msg ) {
        alertbox = getAlert();
        alertbox.message = msg;
        setTimeout(alertbox.alert, 500);
    }

    function generateCaptcha() {
        var a = Math.round(Math.random() * 10),
            b = Math.round(Math.random() * 10);

        answer = a + b;

        return a + ' + ' + b;
    }

        
    //----------------------------------------------------------------------
    // Public scope
    //----------------------------------------------------------------------


    this.send = function( form ) {

        savedForm = form;

        validate();

    };

    this.verify = function( field ) {

        var resp = field.querySelector('#captcha').value;
        alertbox = getAlert();
        alertbox.callback = null;
        
        if(resp != answer) {
            
            alert('Fel svar...');

        } else {
            
            var request = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");

            request.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    var status = JSON.parse(this.responseText);
                    alert(status.status);
                }
            };
            
            var formData = new FormData(savedForm);
            request.open('POST', '../resources/services/mail.php');
            request.send(formData);

        }

    };

    return this;

});