$(function() {
	//GET/READ
	$('#get-commandX').on('click', function() {
		$.ajax({
			url: '/commandX',
			}		
		});
	});

		//GET/READ
	$('#get-commandSTOP').on('click', function() {
		$.ajax({
			url: '/commandSTOP',
			}
		});
	});
			//GET/READ
	$('#get-commanda20').on('click', function() {
		$.ajax({
			url: '/commanda20',
			}
		});
	});




	
});
