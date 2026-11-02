namespace SchoolManagement.Application.ApplicationServices.Maps_Dto.ClassRoom;

public class ClassRoomDto
{
    public string Location { get; set; } = string.Empty;
    public bool IsAviable { get; set; } = true;
    public int Capacity { get; set; } = 30;
    public int IdInstitution { get; set; }
}