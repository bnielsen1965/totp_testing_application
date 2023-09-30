# TOTP Testing Application

This is a service used to test and/or demonstrate TOTP authentication.

The service is a NodeJS application that can be executed on any machine after installing the NodeJS engine.
After configuring and executing the service it will provide a web page on the configured port that can be 
opened in a browser where TOTP can be tested.

I.E. http://localhost:8888/


The TOTP details on the web page should be entered into a TOTP authenticator application or the QR code 
should be scanned by the authenticator application.

Once the TOTP service is setup in the authenticator application the authentication codes can be entered 
into the web page to test TOTP authentication.
