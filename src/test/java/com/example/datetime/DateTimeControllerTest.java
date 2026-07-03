package com.example.datetime;

import static org.hamcrest.Matchers.not;
import static org.hamcrest.Matchers.blankOrNullString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(DateTimeController.class)
class DateTimeControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void shouldReturnCurrentDateTime() throws Exception {
        mockMvc.perform(get("/api/datetime"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.date", not(blankOrNullString())))
                .andExpect(jsonPath("$.time", not(blankOrNullString())))
                .andExpect(jsonPath("$.dateTime", not(blankOrNullString())))
                .andExpect(jsonPath("$.timeZone", not(blankOrNullString())));
    }
}
