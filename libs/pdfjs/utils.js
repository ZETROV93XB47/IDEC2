//Modification de la taille du pdf si le document change de taille (ex : rotation tel) afin qu'il reste centré

function resizeHandler()
{
	if (document.getElementById("pdf-main-container") != undefined)
	{
		//document.getElementById("advanced-tools").style.top = 0 + "px";
		//document.getElementById("pdf-info-zoom").style.marginTop = document.getElementById("advanced-tools").offsetHeight + "px";
		var constante = document.getElementById("basic-tools").offsetHeight;
		
		var width = document.getElementById("pdf-contents").offsetWidth;
		var height = document.documentElement.clientHeight - constante;
		
		var pdfwidth = document.getElementById("pdf-canvas").offsetWidth;
		var pdfheight = document.getElementById("pdf-canvas").offsetHeight;
		var finalwidth = (width - pdfwidth) / 2;
		var finalheight = (height - pdfheight) / 2 ;
		
		//Gestion du cas d'un doc plus grand que la page (Zoom)
		if (finalwidth < 0) finalwidth = 0;
		if (finalheight < 0) finalheight = 0;
		//Affectation de la valeur
		document.getElementById("pdf-canvas").style.marginLeft = finalwidth + "px";
		//document.getElementById("pdf-canvas").style.marginTop = document.getElementById("advanced-tools").offsetHeight + "px";
		document.getElementById("pdf-canvas").style.marginBottom = document.getElementById("basic-tools").offsetHeight + "px";
	}
}


window.onresize = resizeHandler;

var __PDF_DOC,
	__CURRENT_PAGE,
	__TOTAL_PAGES,
	__PAGE_RENDERING_IN_PROGRESS = 0/*
,
	__CANVAS = $('#pdf-canvas').get(0),
	__CANVAS_CTX = __CANVAS.getContext('2d')
*/;

function init(){
	__CANVAS = $('#pdf-canvas').get(0),
	__CANVAS_CTX = __CANVAS.getContext('2d');
}

function showPDF(arrayBufferOfPdfData) {
	$("#pdf-loader").show();
	$("#board").hide();
	pdfjsLib.getDocument(arrayBufferOfPdfData).then(function(pdf_doc) {
		
		__PDF_DOC = pdf_doc;
		__TOTAL_PAGES = __PDF_DOC.numPages;
		
		// Hide the pdf loader and show pdf container in HTML
		$("#pdf-loader").hide();
		$("#pdf-contents").show();
		$("#upload-button").hide();
		$("#pdf-total-pages").text(__TOTAL_PAGES);

		// Show the first page
		showPage(1);
	}).catch(function(error) {
		// If error re-show the upload button
		$("#pdf-loader").hide();
		$("#upload-button").show();
		$("#board").show();
		
		alert(error.message);
	});;
}

function hidePDF() {
	$("#pdf-loader").hide();
	$("#pdf-contents").hide();
	$("#upload-button").show();
	$("#board").show();
}

//Eviter de devoir selectionner un fichier a chaques fois (pour les tests)
//showPDF("./compressed.tracemonkey-pldi-09.pdf");

function showPage(page_no) {
	__PAGE_RENDERING_IN_PROGRESS = 1;
	__CURRENT_PAGE = page_no;

	// Disable Prev & Next buttons while page is being loaded
	$("#pdf-next, #pdf-prev").attr('disabled', 'disabled');

	// While page is being rendered hide the canvas and show a loading message
	$("#pdf-canvas").hide();
	$("#page-loader").show();

	// Update current page in HTML
	$("#pdf-current-page").text(page_no);
	
	// Fetch the page
	__PDF_DOC.getPage(page_no).then(function(page) {
		// As the canvas is of a fixed width we need to set the scale of the viewport accordingly
		var scale_required = __CANVAS.width / page.getViewport(1).width;
		// Get viewport of the page at required scale
		var viewport = page.getViewport(scale_required);

		// Set canvas height
		__CANVAS.height = viewport.height;

		var renderContext = {
			canvasContext: __CANVAS_CTX,
			viewport: viewport
		};
		
		// Render the page contents in the canvas
		page.render(renderContext).then(function() {
			__PAGE_RENDERING_IN_PROGRESS = 0;

			// Re-enable Prev & Next buttons
			$("#pdf-next, #pdf-prev").removeAttr('disabled');

			// Show the canvas and hide the page loader
			$("#pdf-canvas").show();
			$("#page-loader").hide();
			resizeHandler();
		});
	});
}

// Upon click this should should trigger click on the #file-to-upload file input element
// This is better than showing the not-good-looking file input element
$("#upload-button").on('click', function() {
	$("#file-to-upload").trigger('click');
});

//Retour à l'accueil
$("#pdf-cancel").on('click', function() {
	hidePDF();
});

// When user chooses a PDF file
$("#file-to-upload").on('change', function() {
	// Validate whether PDF
    if(['application/pdf'].indexOf($("#file-to-upload").get(0).files[0].type) == -1) {
        alert('Error : Not a PDF');
        return;
    }

	$("#upload-button").hide();

	// Send the object url of the pdf
	showPDF(URL.createObjectURL($("#file-to-upload").get(0).files[0]));
});

// Previous page of the PDF
$("#pdf-prev").on('click', function() {
	__CURRENT_PAGE = parseInt($("#pdf-current-page").text(), 10);
	
	if(__CURRENT_PAGE != 1)
		showPage(--__CURRENT_PAGE);
});

// Next page of the PDF
$("#pdf-next").on('click', function() {
	__CURRENT_PAGE = parseInt($("#pdf-current-page").text(), 10);
	if(__CURRENT_PAGE != __TOTAL_PAGES)
		showPage(++__CURRENT_PAGE);
});


// First page of the PDF
$("#pdf-first").on('click', function() {
	if(__CURRENT_PAGE != 1)
		showPage(1);
});

// Next page of the PDF
$("#pdf-last").on('click', function() {
	if(__CURRENT_PAGE != __TOTAL_PAGES)
		showPage(__TOTAL_PAGES);
});


var zoom = 100
// Zoomer
$("#pdf-zoom").on('click', function() {
	if(document.getElementById("pdf-canvas").style.maxWidth == "100%"){
		zoom = 100
	}else if(document.getElementById("pdf-canvas").style.maxWidth == ""){
		document.getElementById("pdf-canvas").style.maxWidth = "100%"
		zoom = 100
	}
	if((zoom+50)<=500){
		 //Sera changé soon
		if(zoom < 100)
			zoom += 25
		else
			zoom += 50
			
		document.getElementById("pdf-canvas").style.maxWidth = zoom+"%"
		$("#basic-tools").attr('ws_zoom', zoom);
		resizeHandler();
	}
});

// Dézoomer
$("#pdf-unzoom").on('click', function()
{
	if(document.getElementById("pdf-canvas").style.maxWidth == "100%"){
		zoom = 100
	}else if(document.getElementById("pdf-canvas").style.maxWidth == ""){
		document.getElementById("pdf-canvas").style.maxWidth = "100%"
		zoom = 100
	}
	if((zoom-25)>=50){
		if(zoom <= 100)
			zoom -= 25
		else
			zoom -= 50
		document.getElementById("pdf-canvas").style.maxWidth = zoom+"%"
		$("#basic-tools").attr('ws_zoom', zoom);
		resizeHandler();
	}
});