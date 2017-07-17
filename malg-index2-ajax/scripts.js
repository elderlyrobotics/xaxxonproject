$(function() {
	//GET/READ
	$('#get-button').on('click', function() {
		$.ajax({
			url: '/commands',
			contentType: 'application/json',
			success: function(response) {
				var tbodyEL = $('tbody');

				tbodyEL.html('');

				response.commands.forEach(function(command) {
					tbodyEL.append('\
						<tr>\
							<td><input type="text" class="name" value="' + command.direction + '"></td>\
						<tr>\
					');
				});
			}
		});
	});

	//GET/READ
	$('#get-commandX').on('click', function() {
		$.ajax({
			url: '/commandX',
			contentType: 'application/json',
			success: function(response) {
				var tbodyEL = $('tbody');

				tbodyEL.html('');
			}		
		});
	});

		//GET/READ
	$('#get-commandSTOP').on('click', function() {
		$.ajax({
			url: '/commandSTOP',
			contentType: 'application/json',
			success: function(response) {
				var tbodyEL = $('tbody');

				tbodyEL.html('');

				response.commands.forEach(function(command) {
					tbodyEL.append('\
						<tr>\
							<td><input type="text" class="name" value="' + command.direction + '"></td>\
						<tr>\
					');
				});
			}
		});
	});
			//GET/READ
	$('#get-commanda20').on('click', function() {
		$.ajax({
			url: '/commanda20',
			contentType: 'application/json',
			success: function(response) {
				var tbodyEL = $('tbody');

				tbodyEL.html('');

				response.commands.forEach(function(command) {
					tbodyEL.append('\
						<tr>\
							<td><input type="text" class="name" value="' + command.direction + '"></td>\
						<tr>\
					');
				});
			}
		});
	});

		//GET/READ
	$('#get-commandb20').on('click', function() {
		$.ajax({
			url: '/commandb20',
			contentType: 'application/json',
			success: function(response) {
				var tbodyEL = $('tbody');

				tbodyEL.html('');

				response.commands.forEach(function(command) {
					tbodyEL.append('\
						<tr>\
							<td><input type="text" class="name" value="' + command.direction + '"></td>\
						<tr>\
					');
				});
			}
		});
	});
		//GET/READ
	$('#get-commandv100').on('click', function() {
		$.ajax({
			url: '/commandv100',
			contentType: 'application/json',
			success: function(response) {
				var tbodyEL = $('tbody');

				tbodyEL.html('');

				response.commands.forEach(function(command) {
					tbodyEL.append('\
						<tr>\
							<td><input type="text" class="name" value="' + command.direction + '"></td>\
						<tr>\
					');
				});
			}
		});
	});



	
});
