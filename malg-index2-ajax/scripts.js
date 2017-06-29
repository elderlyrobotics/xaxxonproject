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

	
});
