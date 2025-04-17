import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.xpath.*;
import org.w3c.dom.*;

import java.io.File;

public class MusicXPathFilter {
    public static void main(String[] args) {
        try {
            // Load the XML file
            File file = new File("songs.xml");
            DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
            DocumentBuilder builder = factory.newDocumentBuilder();
            Document doc = builder.parse(file);
            doc.getDocumentElement().normalize();

            // Create XPath object
            XPathFactory xPathFactory = XPathFactory.newInstance();
            XPath xpath = xPathFactory.newXPath();

            // XPath expression to get all Pop genre songs
            String expression = "/songs/song[genre='Pop']";
            NodeList songList = (NodeList) xpath.evaluate(expression, doc, XPathConstants.NODESET);

            System.out.println("🎧 Pop Songs:");
            for (int i = 0; i < songList.getLength(); i++) {
                Node song = songList.item(i);
                if (song.getNodeType() == Node.ELEMENT_NODE) {
                    Element e = (Element) song;
                    System.out.println("Title: " + e.getElementsByTagName("title").item(0).getTextContent());
                    System.out.println("Artist: " + e.getElementsByTagName("artist").item(0).getTextContent());
                    System.out.println("Duration: " + e.getElementsByTagName("duration").item(0).getTextContent() + " mins");
                    System.out.println("-----------------------");
                }
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}