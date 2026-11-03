namespace SchoolManagement.Application.ApplicationServices.Maps_Dto.Reservation;

public class AvailableReservationDto
{
    public List<AvailableClassRoomDto> ClassRooms { get; set; } = new();
    public List<AvailableMeanDto> TechMeans { get; set; } = new();
    public List<AvailableMeanDto> AuxMeans { get; set; } = new();
}

public class AvailableClassRoomDto
{
    public int IdClassR { get; set; }
    public string Location { get; set; } = string.Empty;
    public int Capacity { get; set; }
}

public class AvailableMeanDto
{
    public int IdMean { get; set; }
    public string NameMean { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
}