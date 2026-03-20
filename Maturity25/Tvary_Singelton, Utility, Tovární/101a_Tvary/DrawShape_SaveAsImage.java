import java.awt.Canvas;
import java.awt.Color;
import java.awt.Frame;
import java.awt.Graphics;
import java.awt.Graphics2D;
import java.awt.event.WindowAdapter;
import java.awt.event.WindowEvent;
import java.awt.image.BufferedImage;
import java.io.File;

import javax.imageio.ImageIO;

public class DrawShape_SaveAsImage extends Canvas {

	public static void main(String[] args) {
		Frame f=new Frame("Draw shape and text on Canvas");
		final Canvas canvas=new DrawShape_SaveAsImage();
		
		f.add(canvas);
		
		f.setSize(300,300);
		f.setVisible(true);
		f.addWindowListener(new WindowAdapter() {
			public void windowClosing(WindowEvent event) {
				saveCanvas(canvas);
				System.exit(0);
			}
		});

	}

	public void paint(Graphics g) {
		Graphics2D g2=(Graphics2D)g;
		g2.setBackground(Color.WHITE);
		g2.clearRect(0, 0, this.getWidth(), this.getHeight());
		g2.setColor(Color.BLACK);
		g2.drawString("Draw a rectangle", 100,100);
		g2.drawRect(100,200,50,50);
	}
	
	public static void saveCanvas(Canvas canvas) {

		BufferedImage image=new BufferedImage(canvas.getWidth(), canvas.getHeight(),BufferedImage.TYPE_INT_RGB);
		
		Graphics2D g2=(Graphics2D)image.getGraphics();
		
		
		canvas.paint(g2);
		try {
			ImageIO.write(image, "png", new File("canvas.png"));
		} catch (Exception e) {
			
		}
	}
}
