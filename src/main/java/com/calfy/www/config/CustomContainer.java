package com.calfy.www.config;

import org.springframework.boot.context.embedded.ConfigurableEmbeddedServletContainer;
import org.springframework.boot.context.embedded.EmbeddedServletContainerCustomizer;

public class CustomContainer implements EmbeddedServletContainerCustomizer {

	@Override
	public void customize(ConfigurableEmbeddedServletContainer container) {
	     if(System.getenv("PORT")!=null) { 
			System.out.println("listening on localhost:"+System.getenv("PORT"));
			container.setContextPath(""); 
			container.setPort(Integer.valueOf(System.getenv("PORT"))); 
	     } else{
			System.out.println("listening on localhost:8080");
		}
	}

}
