KMOJ
----------------------------------------------
Full stack application to help KMOJ Radio's lives a little easier in their day to day functions.

Technologies Used: Angular, Angular-Aria, Angular-Material, Angular-Messages, Bootstrap, JQuery, Moment-With-Locales, pdfmake, xeditable, Sass, Node, Nodemailer, Express, SQL, Firebase.

Greater Details
------------------------------------------------------------------------

KMOJ Radio’s current process for bringing on new underwriters to supplement station funding is done using paper forms. This process is cumbersome and prone to error. Filling out and keeping track of forms and the information provided is time consuming and limits the ability of the sales representatives to fulfill sales expectations. Also, due to the fallible paper processes, radio spots (“commercials”) were liable to miss deadlines or invoicing. There have been instances where spots that did not meet approval or go through the proper channels have been aired.


The goal of this project is to automate and streamline the underwriting process that starts with signing on new clients and ends with scheduled runtime and eventual air-time. It will allow several departments at KMOJ to communicate succinctly and improve procedures, reduces errors, and help add to the station’s revenue stream.
This application will allow all interested parties to digitally access information specific to their needs from a single source and allow them to update the information using a mobile, responsive, and dynamic interface.

Features
------------------------------------------------------------------------------
Mobile responsiveness:
	The application will be built around a responsive and dynamic design. Regardless of which device a user will be using, the application should be easily navigable on a mobile phone or desktop computer.


E-mail notifications:
	There are many internal steps in the underwriting process that must take place in a particular order to move a client from proposal to airtime. At each step there will be a notification system in place to keep everyone involved on the same page. This will be critical for executing KMOJ’s 48-hour to airtime guarantee and it will be important to advancing their work in a short amount of time.


Time monitoring:
Once the Master Document is complete and the data is submitted a timestamp will be assigned to that data set. A 48 hour countdown will begin. All signatures, approvals and additional data will need to be entered within that 48 hour period. Users will be notified visually as the 48 hour deadline approaches and again if the 48 hour deadline expires.


User Authentication:
	There will be four user levels: Admin, Underwriter, Production/Traffic, and Assistant. The Administration level will have the ability to set the permissions of other users. This ability is for the General Manager and the Underwriting Manager. They can view all clients whether they are pending or not. The Underwriter level will have the ability to enter all data in the master document. The Production/Traffic level will be able to view the production form and the run sheet, as well as edit or set the cart number. The Assistant level will be able to view cart information but will not be able to edit or delete information.


Search capabilities:
Basic search capabilities will be built in to find information on any spot by cart number or client name.  This search function will be accessible from the primary views through a navigation link.

Reporting:
 Administrators and possibly others will be able to generate reports and access certain data associated with individual clients and their contract history. These reports will detail the customer name, associated underwriter, the contract value, the cart number and the flight dates.


 Copyright for PDFmaker (also in the code):
--------------------------------------------------------------------------------
  Copyright (c) 2010-2016 James Hall, https://github.com/MrRio/jsPDF

  Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
