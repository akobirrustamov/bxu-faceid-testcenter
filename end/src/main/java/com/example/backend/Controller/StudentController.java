package com.example.backend.Controller;

import com.example.backend.Entity.Attachment;
import com.example.backend.Entity.Groups;
import com.example.backend.Entity.Student;
import com.example.backend.Entity.TokenHemis;
import com.example.backend.Repository.AttachmentRepo;
import com.example.backend.Repository.GroupsRepo;
import com.example.backend.Repository.StudentRepo;
import com.example.backend.Repository.TokenHemisRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URL;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@CrossOrigin
@RequestMapping("/api/v1/student")
public class StudentController {
    private final GroupsRepo groupsRepo;
    private final RestTemplate restTemplate;
    private final TokenHemisRepo tokenHemisRepo;
    private final StudentRepo studentRepo;

    private final AttachmentRepo attachmentRepo;
    @GetMapping("/update/{groupId}")
    public HttpEntity<?> postAllStudents(@PathVariable Integer groupId) {
        Groups group = groupsRepo.findById(groupId).orElse(null);
        if (group == null) return ResponseEntity.badRequest().body("Group not found");

        String apiUrl = "https://student.buxpxti.uz/rest/v1/data/student-list?_group=" + group.getHemisId();
        int page = 1, allPages = 10;

        List<TokenHemis> tokens = tokenHemisRepo.findAll();
        if (tokens.isEmpty()) return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("No token found");

        TokenHemis tokenHemis = tokens.get(tokens.size() - 1);
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(tokenHemis.getName());
        HttpEntity<?> requestEntity = new HttpEntity<>(headers);

        try {
            while (page <= allPages) {
                String url = UriComponentsBuilder.fromHttpUrl(apiUrl).queryParam("page", page).toUriString();
                ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, requestEntity, Map.class);
                Map<String, Object> body = response.getBody();

                if (body != null && body.containsKey("data")) {
                    Map<String, Object> dataMap = (Map<String, Object>) body.get("data");
                    List<Map<String, Object>> items = (List<Map<String, Object>>) dataMap.get("items");

                    for (Map<String, Object> studentData : items) {
                        Integer hemisId = (Integer) studentData.get("id");
                        String fullName = (String) studentData.get("full_name");
                        String shortName = (String) studentData.get("short_name");
                        String studentIdNumber = (String) studentData.get("student_id_number");
                        String image = (String) studentData.get("image");
                        String educationalType = ((Map<String, Object>) studentData.get("educationType")).get("name").toString();
                        String levelName = ((Map<String, Object>) studentData.get("level")).get("name").toString();
                        String semesterName = ((Map<String, Object>) studentData.get("semester")).get("name").toString();
                        String passport_pin = studentData.getOrDefault("passport_pin", "").toString();

                        // Student mavjudligini tekshirish
                        Student student = studentRepo.findByHemisId(hemisId).orElse(new Student());

                        // Rasmni yuklab olish va saqlash
                        Attachment attachment = downloadImage(image, group.getName(), hemisId.toString());

                        // Student obyektini yangilash
                        student.setHemisId(hemisId);
                        student.setFullName(fullName);
                        student.setShortName(shortName);
                        student.setStudentIdNumber(studentIdNumber);
                        student.setImage(image);
                        student.setEducationalType(educationalType);
                        student.setLevel(levelName);
                        student.setSemesterName(semesterName);
                        student.setPassport_pin(passport_pin);
                        student.setGroup(group);
                        student.setUpdated_at(LocalDateTime.now());
                        student.setImage_file(attachment); // Rasmni bog‘lash

                        studentRepo.save(student);
                    }
                    page++;
                } else {
                    break;
                }
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error occurred while saving students: " + e.getMessage());
        }


        return ResponseEntity.ok(studentRepo.findAllByGroupId(groupId));
    }


    private Attachment downloadImage(String imageUrl, String groupName, String studentId) {
        try {
            // Fayl nomi va saqlash yo‘li
            String folderPath = "backend/files/" + groupName;
            String fileName = studentId + ".jpg";
            File folder = new File(folderPath);
            if (!folder.exists()) folder.mkdirs();

            // Faylga yozish
            File file = new File(folder, fileName);
            try (InputStream in = new URL(imageUrl).openStream();
                 OutputStream out = new FileOutputStream(file)) {
                FileCopyUtils.copy(in, out);
            }

            // Attachment saqlash
            Attachment attachment = new Attachment(UUID.randomUUID(), groupName, fileName);
            return attachmentRepo.save(attachment);
        } catch (Exception e) {
            System.err.println("Failed to download image: " + e.getMessage());
            return null;
        }
    }


    @GetMapping("/{studentId}")
    public HttpEntity<?> getStudentById(@PathVariable UUID studentId) {
        Student student = studentRepo.findById(studentId).orElse(null);
        System.out.println(student);
        if (student == null) return ResponseEntity.badRequest().body("Student not found");
        return ResponseEntity.ok(student);
    }
//    @PostMapping("/{studentId}/{attachmentId}")
//    public HttpEntity<?> addAttachment(@PathVariable UUID studentId, @PathVariable UUID attachmentId) {
//        Student student = studentRepo.findById(studentId).orElse(null);
//        Attachment attachment = attachmentRepo.findById(attachmentId).orElse(null);
//        if (attachment == null) return ResponseEntity.badRequest().body("Attachment not found");
//        student.setImage_file(attachment);
//        student.setUpdated_at(LocalDateTime.now());
//        studentRepo.save(student);
//        return ResponseEntity.ok(student);
//    }


    @PostMapping("/{studentId}/{attachmentId}")
    public HttpEntity<?> addAttachment(@PathVariable UUID studentId, @PathVariable UUID attachmentId) {
        Student student = studentRepo.findById(studentId).orElse(null);
        System.out.println(student);
        if (student == null) {
            return ResponseEntity.badRequest().body("Student not found");
        }

        Attachment newAttachment = attachmentRepo.findById(attachmentId).orElse(null);
        if (newAttachment == null) {
            return ResponseEntity.badRequest().body("New attachment not found");
        }

        // Get the old attachment
        Attachment oldAttachment = student.getImage_file();
        System.out.println(oldAttachment);
        if (oldAttachment != null) {
            // Rename the old file to ${filename}_old
            String oldFilePath = "backend/files/" + oldAttachment.getPrefix() + "/" + oldAttachment.getName();
            File oldFile = new File(oldFilePath);
            if (oldFile.exists()) {
                String newOldFilePath = "backend/files/" + oldAttachment.getPrefix() + "/" + oldAttachment.getName().replace(".", "_old.");
                File newOldFile = new File(newOldFilePath);
                if (oldFile.renameTo(newOldFile)) {
                    // Update the old attachment's name in the database
                    oldAttachment.setName(newOldFile.getName());
                    attachmentRepo.save(oldAttachment);
                    System.out.println(oldAttachment);
                } else {
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to rename old file");
                }
            }
        }

        // Define the new file name
        String newFileName = student.getHemisId().toString() + ".jpg";

        // Rename the new attachment's physical file
        String newAttachmentOldPath = "backend/files/" + newAttachment.getPrefix() + "/" + newAttachment.getName();
        String newAttachmentNewPath = "backend/files/" + newAttachment.getPrefix() + "/" + newFileName;

        File newAttachmentOldFile = new File(newAttachmentOldPath);
        File newAttachmentNewFile = new File(newAttachmentNewPath);

        if (newAttachmentOldFile.exists()) {
            if (newAttachmentOldFile.renameTo(newAttachmentNewFile)) {
                // Update the new attachment's name in the database
                newAttachment.setName(newFileName);
                attachmentRepo.save(newAttachment);
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to rename new attachment file");
            }
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("New attachment file not found");
        }

        // Set the new attachment
        student.setImage_file(newAttachment);
        student.setUpdated_at(LocalDateTime.now());
        studentRepo.save(student);

        return ResponseEntity.ok(student);
    }
}
