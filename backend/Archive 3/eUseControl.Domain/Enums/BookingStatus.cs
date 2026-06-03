namespace eUseControl.Domain.Enums;

public enum BookingStatus
{
    Pedding = 0,
    Confirmed = 1, 
    Cancelled = 2,
    Completed = 3,
    
    // клиент не пришел на услугу  
    NoShow = 4,
    Rejected = 5,
        
}
