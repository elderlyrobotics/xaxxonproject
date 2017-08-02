$(function() {
	//GET/READ
	$('#get-commandX').on('click', function() {
		$.ajax({
			url: '/commandX'	
		});
	});

	//GET/READ
	$('#get-stop').on('click', function() {
		$.ajax({
			url: '/commandStop'
		});
	});
	
	//GET/READ
	$('#get-up').on('click', function() {
		$.ajax({
			url: '/commandUp'
		});
	});
	
	//GET/READ
	$('#get-down').on('click', function() {
		$.ajax({
			url: '/commandDown'
		});
	});
	
	//GET/READ
	$('#get-left').on('click', function() {
		$.ajax({
			url: '/commandLeft'
		});
	});
	
	//GET/READ
	$('#get-right').on('click', function() {
		$.ajax({
			url: '/commandRight'
		});
	});

});
