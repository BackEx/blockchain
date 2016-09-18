contract deal {
    address buyer;
    address seller;
    bool is_offer_provided = false;
    bool is_get_payment = false;
    bool is_complete = false;
    
    function deal(address _buyer, address _seller) public {
        buyer = _buyer;
        seller = _seller;
    }
    
    function offerHasProvided() {
        is_offer_provided = true;
    }
    
    function isOfferProvided() constant returns (bool) {
        return is_offer_provided;
    }
    
    function setPaymentStatus() {
        is_get_payment = true;
    }
    
    function getPaymentStatus() constant returns (bool) {
        return is_get_payment;
    }
    
    function complete() constant returns (bool) {
        if (getPaymentStatus() && isOfferProvided()) {
            is_complete = true;
            return true;
        }
    }
}
