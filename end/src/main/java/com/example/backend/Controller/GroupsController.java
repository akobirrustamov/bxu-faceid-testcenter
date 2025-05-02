package com.example.backend.Controller;

import com.example.backend.Entity.Groups;
import com.example.backend.Entity.Student;
import com.example.backend.Entity.TokenHemis;
import com.example.backend.Repository.GroupsRepo;
import com.example.backend.Repository.StudentRepo;
import com.example.backend.Repository.TokenHemisRepo;
import lombok.RequiredArgsConstructor;
import org.apache.catalina.Group;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequiredArgsConstructor
@CrossOrigin
@RequestMapping("/api/v1/groups")
public class GroupsController {
    private final GroupsRepo groupsRepo;
    private final RestTemplate restTemplate;
    private final TokenHemisRepo tokenHemisRepo;
    private final StudentRepo studentRepo;

    @GetMapping("/{groupId}")
    public ResponseEntity<?> getGroupById(@PathVariable Integer groupId){
        Groups group = groupsRepo.findById(groupId).orElse(null);
        if(group == null){
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(group);
    }

    @GetMapping
    public HttpEntity<?> getGroups() {
        List<Groups> all = groupsRepo.findAll();
        return new ResponseEntity<>(all, HttpStatus.OK);
    }
    @GetMapping("/update")
    public HttpEntity<?> postAllGroups() {
        String apiUrl = "https://student.buxpxti.uz/rest/v1/data/group-list";
        int page = 1;
        int allPages = 200;
        List<TokenHemis> all = tokenHemisRepo.findAll();
        TokenHemis tokenHemis = all.get(all.size() - 1);
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(tokenHemis.getName());
        HttpEntity<?> requestEntity = new HttpEntity<>(headers);

        try {
            while (allPages > page) {
                String url = UriComponentsBuilder.fromHttpUrl(apiUrl)
                        .queryParam("page", page)
                        .toUriString();

                ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, requestEntity, Map.class);
                Map<String, Object> body = response.getBody();
                if (body != null && body.containsKey("data")) {
                    Object dataObj = body.get("data");

                    if (dataObj instanceof Map) {
                        Map<String, Object> dataMap = (Map<String, Object>) dataObj;
                        List<Map<String, Object>> items = (List<Map<String, Object>>) dataMap.get("items");
                        for (Map<String, Object> groupData : items) {
                            Groups group = mapToGroupEntity(groupData);

                            // **Bu yerda tekshiramiz**
                            if (!groupsRepo.findByHemisId(group.getHemisId()).isPresent()) {
                                groupsRepo.save(group);
                            }
                        }
                    }

                    page += 1;
                }
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error occurred while saving groups: " + e.getMessage());
        }

        return ResponseEntity.ok("Groups saved successfully");
    }


    private Groups mapToGroupEntity(Map<String, Object> groupData) {
        String name = (String) groupData.get("name");
        Integer hemisId = (Integer) groupData.get("id");

        String departmentName = extractNestedField(groupData, "department", "name");

        // "department" bo'limi mavjudligini tekshirib, "id" ni olish
        Integer departmentId = null;
        if (groupData.containsKey("department") && groupData.get("department") instanceof Map) {
            Map<String, Object> departmentMap = (Map<String, Object>) groupData.get("department");
            if (departmentMap.containsKey("id")) {
                departmentId = (departmentMap.get("id") instanceof Integer)
                        ? (Integer) departmentMap.get("id")
                        : Integer.parseInt(departmentMap.get("id").toString());
            }
        }

        String specialtyName = extractNestedField(groupData, "specialty", "name");

        return new Groups(hemisId, name, departmentId, departmentName, specialtyName, LocalDateTime.now());
    }




    private String extractNestedField(Map<String, Object> data, String field, String subField) {
        if (data.containsKey(field)) {
            Map<String, Object> nestedField = (Map<String, Object>) data.get(field);
            if (nestedField != null && nestedField.containsKey(subField)) {
                return (String) nestedField.get(subField);
            }
        }
        return null; // Return null if any field is missing
    }


    @GetMapping("/students/{groupId}")
    public HttpEntity<?> getStudents(@PathVariable Integer groupId) {

        List<Student> students = studentRepo.findAllByGroupId(groupId);
        System.out.println(students);
        return new ResponseEntity<>(students, HttpStatus.OK);
    }

}
