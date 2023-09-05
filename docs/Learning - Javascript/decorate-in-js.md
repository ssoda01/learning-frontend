# decorate-in-js

总听说spring boot的装饰器很方便，@一下就可以生成swagger。
```java
@RestController
@RequestMapping("/api")
@Api(tags = "示例API")
public class SampleController {

    @GetMapping("/hello")
    @ApiOperation("欢迎接口")
    public String hello() {
        return "Hello, Swagger!";
    }
}
```

后来发现原来js里也有装饰器。