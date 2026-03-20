
 


import java.io.PrintWriter;
import java.io.StringReader;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;

import org.w3c.dom.CharacterData;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;
import org.w3c.dom.Node;

import org.xml.sax.InputSource;

public class DomMain {

  public static void main(String arg[]) throws Exception {
	  PrintWriter out=new PrintWriter(System.out);
	  test(out);
	  out.flush();
  }
  
  public static void test(PrintWriter out) throws Exception {
  
     DocumentBuilderFactory factory=DocumentBuilderFactory.newInstance();
     DocumentBuilder builder=factory.newDocumentBuilder();
     InputSource xmlSource=new InputSource(new StringReader("<table><tr><td>cell1</td><td>cell2</td></tr></table>"));
     Document doc=builder.parse(xmlSource);
     NodeList cells=doc.getElementsByTagName("td");
     for(int i=0; i<cells.getLength(); i++) {
    	 Element td=(Element)cells.item(i);
    	 String value=getText(td);
    	 out.println(value);
     }
     /**
      * output:
      * cell1
      * cell2
      */

  }

  public static String getText(Element e) {
    Node child = e.getFirstChild();
    if (child instanceof CharacterData) {
       CharacterData cd = (CharacterData) child;
       return cd.getData();
    }
    return "";
  }
}

