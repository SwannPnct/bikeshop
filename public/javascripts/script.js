var stripe = Stripe('pk_test_51I9p5tCWsKpkke60fc7jwyXDIxf94jar0zAvSbQ1K0PQItCW8wYNMfu3R9gqYJq2vaYXnHCpi86wfXoMLbClAnKx00edqqZDrz');
      var checkoutButton = document.getElementById('button-checkout');

      checkoutButton.addEventListener('click', function() {
        
        fetch('/create-checkout-session', {
          method: 'POST',
        })
        .then(function(response) {
          return response.json();
        })
        .then(function(session) {
          return stripe.redirectToCheckout({ sessionId: session.id });
        })
        .then(function(result) {
          
          if (result.error) {
            alert(result.error.message);
          }
        })
        .catch(function(error) {
          console.error('Error:', error);
        });
      });