package top.angeya.chinses.chess.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * @author: Angeya
 * @date: 2022/3/13 11:01
 * @description:
 */
@Controller
public class IndexController {

    @GetMapping("/index")
    public String getIndex() {
        return "index";
    }
}
