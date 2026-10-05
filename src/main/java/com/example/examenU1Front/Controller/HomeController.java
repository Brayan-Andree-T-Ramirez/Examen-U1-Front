package com.example.examenU1Front.Controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@Controller
public class HomeController {
    @GetMapping("/")
    public String home(){
        return "registro";
    }

    @GetMapping("/registro")
    public String registro(){
        return "registro" ;
    }

    @GetMapping("/buscar")
    public String buscar(){
        return "buscar";
    }

}
