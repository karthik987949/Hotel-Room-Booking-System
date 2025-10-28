package com.hotelbooking.config;

import com.hotelbooking.model.*;
import com.hotelbooking.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Arrays;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private HotelRepository hotelRepository;

    @Autowired
    private RoomTypeRepository roomTypeRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Only initialize if database is empty
        if (userRepository.count() == 0) {
            initializeData();
        }
    }

    private void initializeData() {
        // Create sample users with profile data
        User customer = new User();
        customer.setEmail("customer@example.com");
        customer.setPassword(passwordEncoder.encode("password123"));
        customer.setFirstName("Rahul");
        customer.setLastName("Sharma");
        customer.setPhone("+919876543210");
        customer.setRole(UserRole.CUSTOMER);
        customer.setProfilePicture("https://ui-avatars.com/api/?name=Rahul+Sharma&background=4f46e5&color=fff&size=200");
        customer.setDateOfBirth("1990-05-15");
        customer.setAddress("123 MG Road");
        customer.setCity("Mumbai");
        customer.setState("Maharashtra");
        customer.setPostalCode("400001");
        customer.setCountry("India");
        customer.setEmergencyContactName("Priya Sharma");
        customer.setEmergencyContactPhone("+919876543220");
        customer.setPreferredLanguage("English");
        customer.setNotificationPreferences("EMAIL");
        userRepository.save(customer);

        User admin = new User();
        admin.setEmail("admin@example.com");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setFirstName("Admin");
        admin.setLastName("User");
        admin.setPhone("+919876543211");
        admin.setRole(UserRole.HOTEL_ADMIN);
        admin.setProfilePicture("https://ui-avatars.com/api/?name=Admin+User&background=dc2626&color=fff&size=200");
        admin.setDateOfBirth("1985-08-20");
        admin.setAddress("456 Business District");
        admin.setCity("Delhi");
        admin.setState("Delhi");
        admin.setPostalCode("110001");
        admin.setCountry("India");
        admin.setEmergencyContactName("Support Team");
        admin.setEmergencyContactPhone("+919876543221");
        admin.setPreferredLanguage("English");
        admin.setNotificationPreferences("BOTH");
        userRepository.save(admin);

        // Create Indian hotels with images and INR prices
        Hotel hotel1 = new Hotel();
        hotel1.setName("The Taj Mahal Palace");
        hotel1.setDescription("Iconic luxury hotel overlooking the Gateway of India with world-class amenities, heritage architecture, and exceptional hospitality.");
        hotel1.setAddress("Apollo Bunder, Colaba");
        hotel1.setCity("Mumbai");
        hotel1.setCountry("India");
        hotel1.setLatitude(new BigDecimal("18.9220"));
        hotel1.setLongitude(new BigDecimal("72.8332"));
        hotel1.setStarRating(5);
        hotel1.setAmenities("[\"WiFi\", \"Pool\", \"Gym\", \"Spa\", \"Restaurant\", \"Room Service\", \"Valet Parking\", \"Business Center\"]");
        hotel1.setMainImageUrl("https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800");
        hotel1.setImageUrls("[\"https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800\", \"https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800\", \"https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800\"]");
        hotelRepository.save(hotel1);

        Hotel hotel2 = new Hotel();
        hotel2.setName("Leela Palace Goa");
        hotel2.setDescription("Beachfront luxury resort with stunning Arabian Sea views, private beach access, and world-class amenities in South Goa.");
        hotel2.setAddress("Mobor Beach, Cavelossim");
        hotel2.setCity("Goa");
        hotel2.setCountry("India");
        hotel2.setLatitude(new BigDecimal("15.2993"));
        hotel2.setLongitude(new BigDecimal("74.1240"));
        hotel2.setStarRating(5);
        hotel2.setAmenities("[\"WiFi\", \"Private Beach\", \"Pool\", \"Spa\", \"Restaurant\", \"Bar\", \"Water Sports\", \"Kids Club\"]");
        hotel2.setMainImageUrl("https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800");
        hotel2.setImageUrls("[\"https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800\", \"https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800\", \"https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800\"]");
        hotelRepository.save(hotel2);

        Hotel hotel3 = new Hotel();
        hotel3.setName("Wildflower Hall Shimla");
        hotel3.setDescription("Luxury mountain resort in the Himalayas offering breathtaking views, adventure activities, and serene mountain hospitality.");
        hotel3.setAddress("Chharabra, Kufri Road");
        hotel3.setCity("Shimla");
        hotel3.setCountry("India");
        hotel3.setLatitude(new BigDecimal("31.1048"));
        hotel3.setLongitude(new BigDecimal("77.1734"));
        hotel3.setStarRating(5);
        hotel3.setAmenities("[\"WiFi\", \"Mountain Views\", \"Spa\", \"Restaurant\", \"Adventure Sports\", \"Fireplace\", \"Hiking Trails\"]");
        hotel3.setMainImageUrl("https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop");
        hotel3.setImageUrls("[\"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop\", \"https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&h=600&fit=crop\", \"https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop\"]");
        hotelRepository.save(hotel3);

        Hotel hotel4 = new Hotel();
        hotel4.setName("ITC Grand Chola Chennai");
        hotel4.setDescription("Magnificent luxury hotel inspired by Chola architecture, offering world-class amenities and authentic South Indian hospitality.");
        hotel4.setAddress("63, Mount Road, Guindy");
        hotel4.setCity("Chennai");
        hotel4.setCountry("India");
        hotel4.setLatitude(new BigDecimal("13.0827"));
        hotel4.setLongitude(new BigDecimal("80.2707"));
        hotel4.setStarRating(5);
        hotel4.setAmenities("[\"WiFi\", \"Pool\", \"Gym\", \"Spa\", \"Multiple Restaurants\", \"Business Center\", \"Banquet Halls\"]");
        hotel4.setMainImageUrl("https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800");
        hotel4.setImageUrls("[\"https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800\", \"https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800\", \"https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800\"]");
        hotelRepository.save(hotel4);

        Hotel hotel5 = new Hotel();
        hotel5.setName("Rambagh Palace Jaipur");
        hotel5.setDescription("Former royal palace turned luxury hotel, offering regal experiences with authentic Rajasthani culture and world-class amenities.");
        hotel5.setAddress("Bhawani Singh Road");
        hotel5.setCity("Jaipur");
        hotel5.setCountry("India");
        hotel5.setLatitude(new BigDecimal("26.9124"));
        hotel5.setLongitude(new BigDecimal("75.7873"));
        hotel5.setStarRating(5);
        hotel5.setAmenities("[\"WiFi\", \"Palace Gardens\", \"Spa\", \"Heritage Restaurant\", \"Royal Suites\", \"Cultural Shows\", \"Vintage Car Rides\"]");
        hotel5.setMainImageUrl("https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800");
        hotel5.setImageUrls("[\"https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800\", \"https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800\", \"https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800\"]");
        hotelRepository.save(hotel5);

        // HYDERABAD HOTELS
        Hotel hotel6 = new Hotel();
        hotel6.setName("ITC Kohenur Hyderabad");
        hotel6.setDescription("Luxury business hotel in HITEC City with contemporary design, world-class amenities, and exceptional service for business and leisure travelers.");
        hotel6.setAddress("HITEC City, Madhapur");
        hotel6.setCity("Hyderabad");
        hotel6.setCountry("India");
        hotel6.setLatitude(new BigDecimal("17.4435"));
        hotel6.setLongitude(new BigDecimal("78.3772"));
        hotel6.setStarRating(5);
        hotel6.setAmenities("[\"WiFi\", \"Pool\", \"Gym\", \"Spa\", \"Business Center\", \"Multiple Restaurants\", \"Conference Rooms\", \"Valet Parking\"]");
        hotel6.setMainImageUrl("https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800");
        hotel6.setImageUrls("[\"https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800\", \"https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800\", \"https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800\"]");
        hotelRepository.save(hotel6);

        Hotel hotel7 = new Hotel();
        hotel7.setName("Taj Falaknuma Palace");
        hotel7.setDescription("Magnificent palace hotel perched 2000 feet above Hyderabad, offering royal luxury with panoramic city views and heritage architecture.");
        hotel7.setAddress("Engine Bowli, Falaknuma");
        hotel7.setCity("Hyderabad");
        hotel7.setCountry("India");
        hotel7.setLatitude(new BigDecimal("17.3616"));
        hotel7.setLongitude(new BigDecimal("78.4747"));
        hotel7.setStarRating(5);
        hotel7.setAmenities("[\"WiFi\", \"Palace Gardens\", \"Spa\", \"Heritage Restaurant\", \"Royal Suites\", \"Library\", \"Vintage Car Collection\", \"Butler Service\"]");
        hotel7.setMainImageUrl("https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800");
        hotel7.setImageUrls("[\"https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800\", \"https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800\", \"https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800\"]");
        hotelRepository.save(hotel7);

        // BANGALORE HOTELS
        Hotel hotel8 = new Hotel();
        hotel8.setName("The Leela Palace Bangalore");
        hotel8.setDescription("Art-deco inspired luxury hotel in the heart of Bangalore with exquisite interiors, fine dining, and world-class amenities.");
        hotel8.setAddress("23, Kodihalli, HAL Airport Road");
        hotel8.setCity("Bangalore");
        hotel8.setCountry("India");
        hotel8.setLatitude(new BigDecimal("12.9716"));
        hotel8.setLongitude(new BigDecimal("77.5946"));
        hotel8.setStarRating(5);
        hotel8.setAmenities("[\"WiFi\", \"Pool\", \"Gym\", \"Spa\", \"Fine Dining\", \"Business Center\", \"Art Gallery\", \"Concierge Service\"]");
        hotel8.setMainImageUrl("https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800");
        hotel8.setImageUrls("[\"https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800\", \"https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800\", \"https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800\"]");
        hotelRepository.save(hotel8);

        Hotel hotel9 = new Hotel();
        hotel9.setName("ITC Gardenia Bangalore");
        hotel9.setDescription("Eco-friendly luxury hotel with LEED Platinum certification, offering sustainable luxury in the Garden City with lush green surroundings.");
        hotel9.setAddress("1, Residency Road");
        hotel9.setCity("Bangalore");
        hotel9.setCountry("India");
        hotel9.setLatitude(new BigDecimal("12.9716"));
        hotel9.setLongitude(new BigDecimal("77.5946"));
        hotel9.setStarRating(5);
        hotel9.setAmenities("[\"WiFi\", \"Eco-Friendly\", \"Pool\", \"Spa\", \"Organic Restaurant\", \"Green Gardens\", \"Business Center\", \"Yoga Studio\"]");
        hotel9.setMainImageUrl("https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800");
        hotel9.setImageUrls("[\"https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800\", \"https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800\", \"https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800\"]");
        hotelRepository.save(hotel9);

        // TIRUPATI HOTELS
        Hotel hotel10 = new Hotel();
        hotel10.setName("Fortune Select Grand Ridge");
        hotel10.setDescription("Premium hotel near Tirupati Temple with comfortable accommodations, modern amenities, and easy access to the sacred Tirumala hills.");
        hotel10.setAddress("14-38, Renigunta Road");
        hotel10.setCity("Tirupati");
        hotel10.setCountry("India");
        hotel10.setLatitude(new BigDecimal("13.6288"));
        hotel10.setLongitude(new BigDecimal("79.4192"));
        hotel10.setStarRating(4);
        hotel10.setAmenities("[\"WiFi\", \"Restaurant\", \"Temple Transport\", \"Pilgrimage Services\", \"Conference Hall\", \"Travel Desk\", \"Parking\"]");
        hotel10.setMainImageUrl("https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800");
        hotel10.setImageUrls("[\"https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800\", \"https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800\", \"https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800\"]");
        hotelRepository.save(hotel10);

        Hotel hotel11 = new Hotel();
        hotel11.setName("Marasa Sarovar Premiere");
        hotel11.setDescription("Spiritual retreat hotel offering comfortable stay for pilgrims with vegetarian dining, temple darshan arrangements, and peaceful ambiance.");
        hotel11.setAddress("Tiruchanur Road");
        hotel11.setCity("Tirupati");
        hotel11.setCountry("India");
        hotel11.setLatitude(new BigDecimal("13.6288"));
        hotel11.setLongitude(new BigDecimal("79.4192"));
        hotel11.setStarRating(4);
        hotel11.setAmenities("[\"WiFi\", \"Vegetarian Restaurant\", \"Temple Services\", \"Meditation Hall\", \"Pilgrimage Guidance\", \"Travel Assistance\"]");
        hotel11.setMainImageUrl("https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=600&fit=crop");
        hotel11.setImageUrls("[\"https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=600&fit=crop\", \"https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop\", \"https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop\"]");
        hotelRepository.save(hotel11);

        // KERALA (KOCHI) HOTELS
        Hotel hotel12 = new Hotel();
        hotel12.setName("Grand Hyatt Kochi Bolgatty");
        hotel12.setDescription("Waterfront luxury resort on Bolgatty Island with stunning backwater views, traditional Kerala architecture, and world-class amenities.");
        hotel12.setAddress("Bolgatty Island");
        hotel12.setCity("Kochi");
        hotel12.setCountry("India");
        hotel12.setLatitude(new BigDecimal("9.9312"));
        hotel12.setLongitude(new BigDecimal("76.2673"));
        hotel12.setStarRating(5);
        hotel12.setAmenities("[\"WiFi\", \"Backwater Views\", \"Pool\", \"Spa\", \"Ayurvedic Treatments\", \"Boat Rides\", \"Kerala Cuisine\", \"Cultural Shows\"]");
        hotel12.setMainImageUrl("https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800");
        hotel12.setImageUrls("[\"https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800\", \"https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800\", \"https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800\"]");
        hotelRepository.save(hotel12);

        // AGRA HOTELS
        Hotel hotel13 = new Hotel();
        hotel13.setName("The Oberoi Amarvilas");
        hotel13.setDescription("Luxury hotel with unobstructed views of the Taj Mahal from every room, offering Mughal-inspired architecture and world-class hospitality.");
        hotel13.setAddress("Taj East Gate Road");
        hotel13.setCity("Agra");
        hotel13.setCountry("India");
        hotel13.setLatitude(new BigDecimal("27.1767"));
        hotel13.setLongitude(new BigDecimal("78.0081"));
        hotel13.setStarRating(5);
        hotel13.setAmenities("[\"WiFi\", \"Taj Mahal Views\", \"Pool\", \"Spa\", \"Mughal Gardens\", \"Fine Dining\", \"Heritage Tours\", \"Butler Service\"]");
        hotel13.setMainImageUrl("https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800");
        hotel13.setImageUrls("[\"https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800\", \"https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800\", \"https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800\"]");
        hotelRepository.save(hotel13);

        // UDAIPUR HOTELS
        Hotel hotel14 = new Hotel();
        hotel14.setName("The Oberoi Udaivilas");
        hotel14.setDescription("Palace hotel on the banks of Lake Pichola with traditional Rajasthani architecture, royal courtyards, and breathtaking lake views.");
        hotel14.setAddress("Haridasji Ki Magri");
        hotel14.setCity("Udaipur");
        hotel14.setCountry("India");
        hotel14.setLatitude(new BigDecimal("24.5854"));
        hotel14.setLongitude(new BigDecimal("73.7125"));
        hotel14.setStarRating(5);
        hotel14.setAmenities("[\"WiFi\", \"Lake Views\", \"Royal Courtyards\", \"Spa\", \"Heritage Restaurant\", \"Boat Rides\", \"Cultural Performances\", \"Palace Tours\"]");
        hotel14.setMainImageUrl("https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800");
        hotel14.setImageUrls("[\"https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800\", \"https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800\", \"https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800\"]");
        hotelRepository.save(hotel14);

        // RISHIKESH HOTELS
        Hotel hotel15 = new Hotel();
        hotel15.setName("Ananda in the Himalayas");
        hotel15.setDescription("Luxury wellness retreat in the Himalayan foothills offering world-class spa treatments, yoga, meditation, and spiritual experiences.");
        hotel15.setAddress("The Palace Estate, Narendra Nagar");
        hotel15.setCity("Rishikesh");
        hotel15.setCountry("India");
        hotel15.setLatitude(new BigDecimal("30.0869"));
        hotel15.setLongitude(new BigDecimal("78.2676"));
        hotel15.setStarRating(5);
        hotel15.setAmenities("[\"WiFi\", \"Spa Treatments\", \"Yoga Classes\", \"Meditation\", \"Himalayan Views\", \"Organic Cuisine\", \"Nature Walks\", \"Wellness Programs\"]");
        hotel15.setMainImageUrl("https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800");
        hotel15.setImageUrls("[\"https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800\", \"https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800\", \"https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800\"]");
        hotelRepository.save(hotel15);

        // Create room types with INR prices
        // Taj Mahal Palace rooms
        RoomType suite1 = new RoomType();
        suite1.setHotel(hotel1);
        suite1.setName("Presidential Suite");
        suite1.setDescription("Luxurious suite with separate living area, king bed, and Gateway of India views.");
        suite1.setCapacity(4);
        suite1.setBasePrice(new BigDecimal("45000.00")); // ₹45,000 per night
        suite1.setAmenities("[\"King Bed\", \"Living Area\", \"Sea View\", \"Mini Bar\", \"Jacuzzi\", \"Butler Service\"]");
        roomTypeRepository.save(suite1);

        RoomType deluxe1 = new RoomType();
        deluxe1.setHotel(hotel1);
        deluxe1.setName("Deluxe Room");
        deluxe1.setDescription("Comfortable room with modern amenities and city or sea views.");
        deluxe1.setCapacity(2);
        deluxe1.setBasePrice(new BigDecimal("18000.00")); // ₹18,000 per night
        deluxe1.setAmenities("[\"Queen Bed\", \"City View\", \"Work Desk\", \"Mini Fridge\", \"Marble Bathroom\"]");
        roomTypeRepository.save(deluxe1);

        // Leela Palace Goa rooms
        RoomType beachVilla = new RoomType();
        beachVilla.setHotel(hotel2);
        beachVilla.setName("Beach Villa");
        beachVilla.setDescription("Spacious villa with direct beach access and private pool.");
        beachVilla.setCapacity(4);
        beachVilla.setBasePrice(new BigDecimal("35000.00")); // ₹35,000 per night
        beachVilla.setAmenities("[\"King Bed\", \"Private Pool\", \"Beach Access\", \"Balcony\", \"Mini Bar\"]");
        roomTypeRepository.save(beachVilla);

        RoomType oceanView = new RoomType();
        oceanView.setHotel(hotel2);
        oceanView.setName("Ocean View Room");
        oceanView.setDescription("Beautiful room with panoramic Arabian Sea views.");
        oceanView.setCapacity(2);
        oceanView.setBasePrice(new BigDecimal("15000.00")); // ₹15,000 per night
        oceanView.setAmenities("[\"Queen Bed\", \"Ocean View\", \"Balcony\", \"Mini Fridge\"]");
        roomTypeRepository.save(oceanView);

        // Wildflower Hall rooms
        RoomType mountainSuite = new RoomType();
        mountainSuite.setHotel(hotel3);
        mountainSuite.setName("Mountain Suite");
        mountainSuite.setDescription("Luxury suite with panoramic Himalayan views and fireplace.");
        mountainSuite.setCapacity(3);
        mountainSuite.setBasePrice(new BigDecimal("25000.00")); // ₹25,000 per night
        mountainSuite.setAmenities("[\"King Bed\", \"Mountain View\", \"Fireplace\", \"Sitting Area\", \"Mini Bar\"]");
        roomTypeRepository.save(mountainSuite);

        // ITC Grand Chola rooms
        RoomType cholaRoom = new RoomType();
        cholaRoom.setHotel(hotel4);
        cholaRoom.setName("Chola Club Room");
        cholaRoom.setDescription("Elegant room with Chola-inspired decor and club lounge access.");
        cholaRoom.setCapacity(2);
        cholaRoom.setBasePrice(new BigDecimal("12000.00")); // ₹12,000 per night
        cholaRoom.setAmenities("[\"King Bed\", \"Club Lounge Access\", \"City View\", \"Work Desk\", \"Mini Bar\"]");
        roomTypeRepository.save(cholaRoom);

        // Rambagh Palace rooms
        RoomType palaceSuite = new RoomType();
        palaceSuite.setHotel(hotel5);
        palaceSuite.setName("Royal Suite");
        palaceSuite.setDescription("Opulent royal suite with heritage furniture and palace garden views.");
        palaceSuite.setCapacity(4);
        palaceSuite.setBasePrice(new BigDecimal("40000.00")); // ₹40,000 per night
        palaceSuite.setAmenities("[\"King Bed\", \"Royal Decor\", \"Garden View\", \"Living Area\", \"Heritage Furniture\", \"Butler Service\"]");
        roomTypeRepository.save(palaceSuite);

        // ITC Kohenur Hyderabad rooms
        RoomType hyderabadSuite = new RoomType();
        hyderabadSuite.setHotel(hotel6);
        hyderabadSuite.setName("Executive Suite");
        hyderabadSuite.setDescription("Spacious suite with city views and executive lounge access.");
        hyderabadSuite.setCapacity(3);
        hyderabadSuite.setBasePrice(new BigDecimal("22000.00")); // ₹22,000 per night
        hyderabadSuite.setAmenities("[\"King Bed\", \"City View\", \"Executive Lounge\", \"Work Desk\", \"Mini Bar\"]");
        roomTypeRepository.save(hyderabadSuite);

        RoomType hyderabadDeluxe = new RoomType();
        hyderabadDeluxe.setHotel(hotel6);
        hyderabadDeluxe.setName("Deluxe Room");
        hyderabadDeluxe.setDescription("Contemporary room with modern amenities and HITEC City views.");
        hyderabadDeluxe.setCapacity(2);
        hyderabadDeluxe.setBasePrice(new BigDecimal("14000.00")); // ₹14,000 per night
        hyderabadDeluxe.setAmenities("[\"Queen Bed\", \"City View\", \"Work Station\", \"Mini Fridge\"]");
        roomTypeRepository.save(hyderabadDeluxe);

        // Taj Falaknuma Palace rooms
        RoomType falaknumaSuite = new RoomType();
        falaknumaSuite.setHotel(hotel7);
        falaknumaSuite.setName("Nizami Suite");
        falaknumaSuite.setDescription("Royal suite with antique furniture and panoramic city views.");
        falaknumaSuite.setCapacity(4);
        falaknumaSuite.setBasePrice(new BigDecimal("55000.00")); // ₹55,000 per night
        falaknumaSuite.setAmenities("[\"King Bed\", \"Antique Furniture\", \"City Views\", \"Royal Bathroom\", \"Butler Service\"]");
        roomTypeRepository.save(falaknumaSuite);

        // Leela Palace Bangalore rooms
        RoomType bangaloreRoyal = new RoomType();
        bangaloreRoyal.setHotel(hotel8);
        bangaloreRoyal.setName("Royal Club Room");
        bangaloreRoyal.setDescription("Elegant room with club privileges and garden views.");
        bangaloreRoyal.setCapacity(2);
        bangaloreRoyal.setBasePrice(new BigDecimal("16000.00")); // ₹16,000 per night
        bangaloreRoyal.setAmenities("[\"King Bed\", \"Garden View\", \"Club Access\", \"Marble Bathroom\"]");
        roomTypeRepository.save(bangaloreRoyal);

        // ITC Gardenia Bangalore rooms
        RoomType gardeniaEco = new RoomType();
        gardeniaEco.setHotel(hotel9);
        gardeniaEco.setName("Eco-Luxury Room");
        gardeniaEco.setDescription("Sustainable luxury room with organic amenities and garden views.");
        gardeniaEco.setCapacity(2);
        gardeniaEco.setBasePrice(new BigDecimal("13000.00")); // ₹13,000 per night
        gardeniaEco.setAmenities("[\"Queen Bed\", \"Eco-Friendly\", \"Garden View\", \"Organic Toiletries\"]");
        roomTypeRepository.save(gardeniaEco);

        // Fortune Select Grand Ridge Tirupati rooms
        RoomType tirupatiDeluxe = new RoomType();
        tirupatiDeluxe.setHotel(hotel10);
        tirupatiDeluxe.setName("Deluxe Room");
        tirupatiDeluxe.setDescription("Comfortable room with temple transport and pilgrimage services.");
        tirupatiDeluxe.setCapacity(3);
        tirupatiDeluxe.setBasePrice(new BigDecimal("8000.00")); // ₹8,000 per night
        tirupatiDeluxe.setAmenities("[\"Twin Beds\", \"Temple Transport\", \"Vegetarian Meals\", \"Pilgrimage Guide\"]");
        roomTypeRepository.save(tirupatiDeluxe);

        // Marasa Sarovar Premiere rooms
        RoomType sarovarRoom = new RoomType();
        sarovarRoom.setHotel(hotel11);
        sarovarRoom.setName("Premium Room");
        sarovarRoom.setDescription("Peaceful room with spiritual ambiance and temple services.");
        sarovarRoom.setCapacity(2);
        sarovarRoom.setBasePrice(new BigDecimal("6500.00")); // ₹6,500 per night
        sarovarRoom.setAmenities("[\"Queen Bed\", \"Temple Services\", \"Meditation Corner\", \"Vegetarian Dining\"]");
        roomTypeRepository.save(sarovarRoom);

        // Grand Hyatt Kochi rooms
        RoomType kochiBackwater = new RoomType();
        kochiBackwater.setHotel(hotel12);
        kochiBackwater.setName("Backwater Villa");
        kochiBackwater.setDescription("Waterfront villa with private balcony and backwater views.");
        kochiBackwater.setCapacity(4);
        kochiBackwater.setBasePrice(new BigDecimal("28000.00")); // ₹28,000 per night
        kochiBackwater.setAmenities("[\"King Bed\", \"Backwater View\", \"Private Balcony\", \"Kerala Decor\"]");
        roomTypeRepository.save(kochiBackwater);

        // Oberoi Amarvilas Agra rooms
        RoomType tajView = new RoomType();
        tajView.setHotel(hotel13);
        tajView.setName("Premier Room with Taj View");
        tajView.setDescription("Luxurious room with unobstructed views of the Taj Mahal.");
        tajView.setCapacity(2);
        tajView.setBasePrice(new BigDecimal("65000.00")); // ₹65,000 per night
        tajView.setAmenities("[\"King Bed\", \"Taj Mahal View\", \"Marble Bathroom\", \"Butler Service\"]");
        roomTypeRepository.save(tajView);

        // Oberoi Udaivilas rooms
        RoomType udaipurPalace = new RoomType();
        udaipurPalace.setHotel(hotel14);
        udaipurPalace.setName("Luxury Suite with Lake View");
        udaipurPalace.setDescription("Royal suite overlooking Lake Pichola with traditional decor.");
        udaipurPalace.setCapacity(3);
        udaipurPalace.setBasePrice(new BigDecimal("48000.00")); // ₹48,000 per night
        udaipurPalace.setAmenities("[\"King Bed\", \"Lake View\", \"Royal Decor\", \"Private Courtyard\"]");
        roomTypeRepository.save(udaipurPalace);

        // Ananda in the Himalayas rooms
        RoomType anandaWellness = new RoomType();
        anandaWellness.setHotel(hotel15);
        anandaWellness.setName("Wellness Suite");
        anandaWellness.setDescription("Tranquil suite with Himalayan views and wellness amenities.");
        anandaWellness.setCapacity(2);
        anandaWellness.setBasePrice(new BigDecimal("35000.00")); // ₹35,000 per night
        anandaWellness.setAmenities("[\"King Bed\", \"Mountain View\", \"Yoga Mat\", \"Meditation Corner\", \"Organic Minibar\"]");
        roomTypeRepository.save(anandaWellness);

        System.out.println("Comprehensive Indian hotel data with 15 hotels across popular destinations initialized successfully!");
    }
}