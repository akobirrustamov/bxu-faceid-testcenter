package com.example.backend.Controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.StringJoiner;

@RestController
@RequiredArgsConstructor
@CrossOrigin
@RequestMapping("/api/v1/access")
public class MyAccessDbController {

    private static final String DB_PATH = "C:/sys.mdb";
    private static final String URL = "jdbc:ucanaccess://" + DB_PATH;

    @GetMapping("/jami")
    public ResponseEntity<?> getJamiTableData() {
        System.out.printf("hi there");
        String tableName = "jami"; // Table to fetch data from
        StringJoiner result = new StringJoiner("\n");
        System.out.printf(result.toString());
        try (Connection conn = DriverManager.getConnection(URL);
             Statement stmt = conn.createStatement()) {

            String query = "SELECT * FROM " + tableName;
            ResultSet rs = stmt.executeQuery(query);

            int columnCount = rs.getMetaData().getColumnCount();

            // Fetch and format all rows
            while (rs.next()) {
                StringJoiner row = new StringJoiner(", ");
                for (int i = 1; i <= columnCount; i++) {
                    row.add(rs.getString(i)); // Fetch each column value
                }
                result.add(row.toString());
            }

            return ResponseEntity.ok(result.toString());

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }
}
