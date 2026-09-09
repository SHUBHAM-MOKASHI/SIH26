from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import random

from app.core.database import SessionLocal, engine, Base
from app.models import Post, BotProfile, LinkScan
from app.services.analyzer import ThreatAnalyzerService

SAMPLE_INDIAN_POSTS = [
    # --- Banking & Financial Scams ---
    {"platform": "X", "region": "Maharashtra", "topic": "#BankingScam", "username": "@mumbai_citizen_ravi", "text": "WARNING! Just received an SMS saying SBI Yono account will be blocked tonight if PAN KYC not updated immediately on link! Total scam!"},
    {"platform": "Telegram", "region": "Delhi", "topic": "#BankingScam", "username": "@delhi_alerts_hub", "text": "Bhai log sab log savdhaan raho, fake HDFC electricity bill cut message aa raha hai. Kisi bhi link pe click mat karna!"},
    {"platform": "X", "region": "Karnataka", "topic": "#BankingScam", "username": "@bengaluru_techie_kiran", "text": "Another UPI reverse payment refund scam doing rounds on WhatsApp groups. Scammers asking for PIN to 'receive' money."},
    {"platform": "Instagram", "region": "Gujarat", "topic": "#BankingScam", "username": "@ahmedabad_updates", "text": "Urgent Alert: Fake Aadhaar verification link circulating in Surat and Ahmedabad. Bank accounts drained in minutes."},
    {"platform": "Telegram", "region": "Uttar Pradesh", "topic": "#BankingScam", "username": "@up_rozgar_portal_fake", "text": "Sarkari kisan subsidy claim karein abhi! Click link to receive Rs 6000 directly in bank without OTP: bit.ly/pm-kisan-claim-2026"},
    {"platform": "X", "region": "Telangana", "topic": "#BankingScam", "username": "@hyderabad_safe_cyber", "text": "Cyberabad police issues fresh advisory regarding fake part-time YouTube video like job scams. Over 40 cases reported this week."},
    {"platform": "X", "region": "West Bengal", "topic": "#BankingScam", "username": "@kolkata_voice_99", "text": "Fake job offer letter with forged Tata Consultancy stamp sent to hundreds of college freshers in Salt Lake."},
    {"platform": "YouTube", "region": "Punjab", "topic": "#BankingScam", "username": "@punjab_tech_guru", "text": "Live Demo: Kaise pehchane fake banking APK files aur cyber fraud se kaise bachein."},

    # --- Exams & Student Protests ---
    {"platform": "X", "region": "Delhi", "topic": "#UPSCProtest", "username": "@delhi_student_union", "text": "Massive peaceful demonstration at Mukherjee Nagar demanding transparency in normalization process. Police barricades placed."},
    {"platform": "Telegram", "region": "Uttar Pradesh", "topic": "#PaperLeakHoax", "username": "@up_leak_news_fast", "text": "Breaking! Kal hone wale state recruitment exam ka complete paper leak ho gaya hai! Join channel for full PDF leak!"},
    {"platform": "X", "region": "Bihar", "topic": "#PaperLeakHoax", "username": "@bihar_youth_front", "text": "Rumors of paper leak in Patna center are completely FALSE. DM Patna confirmed exam commenced smoothly. Do not spread panic."},
    {"platform": "Instagram", "region": "Rajasthan", "topic": "#StudentAlert", "username": "@jaipur_aspirants_hub", "text": "Police deployed across exam centers in Kota & Jaipur. Strict 144 imposed near centers. Sab log calm rahein."},
    {"platform": "X", "region": "Madhya Pradesh", "topic": "#UPSCProtest", "username": "@bhopal_student_cell", "text": "Students memorandum submitted peacefully to Education Board. No violence reported."},

    # --- Deepfakes & Synthetic Media ---
    {"platform": "X", "region": "Maharashtra", "topic": "#DeepfakeAlert", "username": "@factcheck_india_mumbai", "text": "ALERT: The viral audio clip claiming CM ordered bank closures is 100% AI SYNTHETIC AUDIO. Voice cloned using deep learning tool."},
    {"platform": "YouTube", "region": "Delhi", "topic": "#DeepfakeAlert", "username": "@cyber_netra_desk", "text": "Detailed forensic breakdown of the viral election speech deepfake. Note the artifact glitching around the lip-sync area."},
    {"platform": "Instagram", "region": "Karnataka", "topic": "#DeepfakeAlert", "username": "@bengaluru_fact_lab", "text": "Beware of fake viral video showing celebrity endorsing dubious crypto trading application. Pure deepfake fraud!"},
    {"platform": "Telegram", "region": "Tamil Nadu", "topic": "#DeepfakeAlert", "username": "@chennai_viral_media", "text": "Viral video showing explosion at Chennai port is an old Lebanese footage from 2020 miscaptioned. Don't forward!"},

    # --- Civil Infrastructure & Emergencies ---
    {"platform": "X", "region": "Delhi", "topic": "#InfraUpdate", "username": "@delhi_metro_riders", "text": "Yellow line services operating normally with slight 5 min delay due to signaling upgrade at Kashmere Gate."},
    {"platform": "Telegram", "region": "Maharashtra", "topic": "#EmergencyHoax", "username": "@mumbai_blast_rumor_bot", "text": "URGENT WARNING: Water supply across South Mumbai poisoned by terrorists! Do not drink tap water tonight!"},
    {"platform": "X", "region": "Maharashtra", "topic": "#FactCheck", "username": "@mumbai_police_factcheck", "text": "The message claiming Mumbai water contamination is an UTTER HOAX. Strict legal action being initiated against miscreants."},
    {"platform": "X", "region": "Karnataka", "topic": "#BengaluruInfra", "username": "@whitefield_commuters", "text": "Outer Ring Road flyover repair work completed ahead of schedule. Traffic flowing smoothly towards Bellandur."},
    {"platform": "Instagram", "region": "Kerala", "topic": "#KeralaMonsoon", "username": "@kochi_weather_watch", "text": "Orange alert issued for Idukki and Wayanad districts. District administration has SDRF teams on high alert."},
    {"platform": "X", "region": "Tamil Nadu", "topic": "#ChennaiRains", "username": "@chennai_traffic_official", "text": "All subway underpasses cleared of storm water. Metropolitan transport running uninterrupted across the city."},
    {"platform": "X", "region": "Assam", "topic": "#AssamFloods", "username": "@guwahati_relief_unit", "text": "Brahmaputra water levels receded below danger mark in Kaziranga sector. Relief distribution actively ongoing."},
    {"platform": "X", "region": "Odisha", "topic": "#CycloneAlert", "username": "@bhubaneswar_met_centre", "text": "Low pressure area over Bay of Bengal moved towards north-east. No threat of severe cyclone to Odisha coast."},

    # --- Astroturfing & Bot Campaign Posts ---
    {"platform": "X", "region": "Delhi", "topic": "#BoycottECommerce", "username": "@bot_desi_trend_01", "text": "Boycott all online shopping platforms immediately! They are stealing Indian user biometric data! Retweet 100 times! #BoycottECommerce"},
    {"platform": "X", "region": "Maharashtra", "topic": "#BoycottECommerce", "username": "@bot_desi_trend_02", "text": "Boycott all online shopping platforms immediately! They are stealing Indian user biometric data! Retweet 100 times! #BoycottECommerce"},
    {"platform": "X", "region": "Karnataka", "topic": "#BoycottECommerce", "username": "@bot_desi_trend_03", "text": "Boycott all online shopping platforms immediately! They are stealing Indian user biometric data! Retweet 100 times! #BoycottECommerce"},
    {"platform": "X", "region": "Punjab", "topic": "#BoycottECommerce", "username": "@bot_desi_trend_04", "text": "Boycott all online shopping platforms immediately! They are stealing Indian user biometric data! Retweet 100 times! #BoycottECommerce"},
    {"platform": "X", "region": "Gujarat", "topic": "#BoycottECommerce", "username": "@bot_desi_trend_05", "text": "Boycott all online shopping platforms immediately! They are stealing Indian user biometric data! Retweet 100 times! #BoycottECommerce"},

    # --- National Tech & Innovation Topics ---
    {"platform": "X", "region": "Karnataka", "topic": "#DigitalIndia2026", "username": "@isro_space_enthusiast", "text": "Tremendous pride seeing Indian quantum computing startups securing international breakthrough patents!"},
    {"platform": "YouTube", "region": "Telangana", "topic": "#DigitalIndia2026", "username": "@hyderabad_startup_hub", "text": "T-Hub announces 50 new AI security incubator cohorts with DST grant backing. Great milestone!"},
    {"platform": "Instagram", "region": "Maharashtra", "topic": "#CyberSafeIndia", "username": "@pune_cyber_cell", "text": "Free cyber hygiene workshop conducted for 1,200 senior citizens across Pune on preventing phishing calls."},
    {"platform": "X", "region": "Delhi", "topic": "#CyberSafeIndia", "username": "@cert_in_official_feed", "text": "Advisory CI-2026-088: Patches released for multi-vendor router zero-day vulnerability. Update firmware now."},
    {"platform": "X", "region": "Tamil Nadu", "topic": "#SemiconductorMission", "username": "@tamilnadu_tech_board", "text": "Coimbatore advanced electronic fabrication unit inaugurated. Projected to generate 8,000 high-tech jobs."},

    # --- Governance & Elections 2026 ---
    {"platform": "X", "region": "Uttar Pradesh", "topic": "#Elections2026", "username": "@lucknow_civic_poll", "text": "Election Commission releases updated digital voter slip app with enhanced privacy safeguards and biometric verification."},
    {"platform": "Telegram", "region": "West Bengal", "topic": "#Elections2026", "username": "@bengal_electoral_watch", "text": "Fake viral circular claiming voting date postponed in 4 districts is baseless. Polling will take place as scheduled."},
    {"platform": "X", "region": "Bihar", "topic": "#Elections2026", "username": "@patna_news_network", "text": "Over 72% voter turnout recorded peacefully in Phase 1 elections across state constituencies."},
    {"platform": "X", "region": "Punjab", "topic": "#PunjabGovernance", "username": "@amritsar_voice", "text": "State government launches single-window grievance portal for rural farmers and tube-well power connections."},
    {"platform": "Instagram", "region": "Rajasthan", "topic": "#SolarMission", "username": "@bikaner_green_power", "text": "World's largest desert solar park in Bhadla achieves milestone 4 GW renewable generation output today!"},

    # --- Health & Medical Misinformation ---
    {"platform": "Telegram", "region": "Kerala", "topic": "#MedicalHoax", "username": "@ayur_remedies_fast", "text": "Miracle boiled papaya seed cure for all viral diseases hidden by pharma companies! Drink 3 times daily!"},
    {"platform": "X", "region": "Kerala", "topic": "#HealthFactCheck", "username": "@kerala_health_mission", "text": "Public Health Advisory: Please do not consume unverified home concoctions for viral fevers. Consult nearest PHC."},
    {"platform": "X", "region": "Delhi", "topic": "#AirQualityAlert", "username": "@delhi_pollution_tracker", "text": "AQI recorded at 145 (Moderate) across Anand Vihar and RK Puram monitoring stations. Favorable wind speed helping dispersal."},
    {"platform": "Instagram", "region": "Maharashtra", "topic": "#HealthFactCheck", "username": "@mumbai_doctors_forum", "text": "Debunking the fake WhatsApp forward claiming paracetamol tablets contaminated with Machupo virus. Completely false hoax."},
    {"platform": "X", "region": "Gujarat", "topic": "#AyushmanBharat", "username": "@gujarat_health_gov", "text": "Over 50,000 cashless cardiac surgeries successfully conducted under Ayushman card scheme in Ahmedabad hospitals."}
]

# Expanding with 15+ more targeted variants to surpass 50+ posts
EXTENDED_POSTS = [
    {"platform": "Telegram", "region": "Delhi", "topic": "#BankingScam", "username": "@free_recharge_5g_bot", "text": "Jio-Airtel 1 Year 5G recharge free offer for festival! Click link now before midnight: bit.ly/free-5g-recharge-india"},
    {"platform": "X", "region": "Uttar Pradesh", "topic": "#CyberCrimeAlert", "username": "@varanasi_police_desk", "text": "Beware of digital arrest calls impersonating CBI or Customs officials on Skype/WhatsApp video calls. Report to 1930."},
    {"platform": "X", "region": "Maharashtra", "topic": "#CyberCrimeAlert", "username": "@cyber_crime_thane", "text": "Senior citizen saved from losing 45 Lakhs in fake FedEx parcel courier scam due to timely intervention of bank manager."},
    {"platform": "Instagram", "region": "Karnataka", "topic": "#TechInnovation", "username": "@iisc_bangalore_research", "text": "IISc researchers develop low-cost indigenous water desalination membranes for rural villages."},
    {"platform": "X", "region": "Telangana", "topic": "#CyberThreatAlert", "username": "@hyderabad_infosec", "text": "Malicious Android APK disguised as 'Electricity Bill Payment' found exfiltrating OTPs from banking devices in Telangana."},
    {"platform": "X", "region": "West Bengal", "topic": "#CyberSecurity", "username": "@wb_cyber_patrol", "text": "Notice: 12 fraudulent call centers in Sector V Kolkata raided. 24 accused arrested in illegal loan app racket."},
    {"platform": "X", "region": "Punjab", "topic": "#AgriTech2026", "username": "@ludhiana_pau_agri", "text": "Drone-based nano-urea spraying demonstration conducted for 500 progressive paddy farmers in Ludhiana."},
    {"platform": "Telegram", "region": "Bihar", "topic": "#CryptoFraud", "username": "@bihar_crypto_pump99", "text": "Guaranteed 500% profit in 24 hours on Telegram crypto bot investment! Send USDT to receive instant double payout!"},
    {"platform": "X", "region": "Rajasthan", "topic": "#CyberTourism", "username": "@rajasthan_tourism_police", "text": "Tourists advised to book wildlife safari permits ONLY through official sso.rajasthan.gov.in portal. Fake sites blacklisted."},
    {"platform": "YouTube", "region": "Madhya Pradesh", "topic": "#DigitalLiteracy", "username": "@indore_tech_shiksha", "text": "Cyber Suraksha 101: Kaise karein two-factor authentication enable apne Google aur WhatsApp account par."},
    {"platform": "X", "region": "Assam", "topic": "#DisinformationWatch", "username": "@assam_police_factcheck", "text": "Fake video attributing communal clash to Kokrajhar is old footage from another country. Criminal case registered against handles."},
    {"platform": "X", "region": "Odisha", "topic": "#TechNews", "username": "@odisha_skill_mission", "text": "World Skill Center Bhubaneswar graduates 2,400 students in advanced cybersecurity and robotics automation streams."}
]

SAMPLE_BOTS = [
    {"username": "@bot_desi_trend_01", "platform": "X", "followers": 12, "following": 4890, "posts_per_hr": 84.0, "account_age": 4},
    {"username": "@bot_desi_trend_02", "platform": "X", "followers": 8, "following": 4910, "posts_per_hr": 88.5, "account_age": 4},
    {"username": "@bot_desi_trend_03", "platform": "X", "followers": 15, "following": 4820, "posts_per_hr": 79.0, "account_age": 3},
    {"username": "@bot_desi_trend_04", "platform": "X", "followers": 5, "following": 4950, "posts_per_hr": 92.0, "account_age": 2},
    {"username": "@bot_desi_trend_05", "platform": "X", "followers": 19, "following": 4800, "posts_per_hr": 81.0, "account_age": 5},
    {"username": "@free_recharge_5g_bot", "platform": "Telegram", "followers": 3, "following": 3400, "posts_per_hr": 55.0, "account_age": 6},
    {"username": "@mumbai_blast_rumor_bot", "platform": "Telegram", "followers": 22, "following": 2900, "posts_per_hr": 62.0, "account_age": 8},
    {"username": "@bihar_crypto_pump99", "platform": "Telegram", "followers": 14, "following": 4100, "posts_per_hr": 48.0, "account_age": 11},
    {"username": "@up_leak_news_fast", "platform": "Telegram", "followers": 45, "following": 2200, "posts_per_hr": 38.0, "account_age": 14},
    {"username": "@mumbai_citizen_ravi", "platform": "X", "followers": 1420, "following": 510, "posts_per_hr": 1.2, "account_age": 1400},
    {"username": "@bengaluru_techie_kiran", "platform": "X", "followers": 8900, "following": 620, "posts_per_hr": 0.8, "account_age": 2100},
    {"username": "@cert_in_official_feed", "platform": "X", "followers": 95000, "following": 45, "posts_per_hr": 0.4, "account_age": 3500}
]

SAMPLE_LINKS = [
    {"url": "http://secure-login-hdfc-kyc-update.xyz/verify-pan"},
    {"url": "http://192.168.45.12/sbi-yono-apk-download.apk"},
    {"url": "http://gov-portal-subsidy-claim-forms.online/free-kisan"},
    {"url": "http://jio-5g-unlimited-festival-recharge.site/claim"},
    {"url": "http://upsc-paper-leak-question-pdf.ru/download.zip"},
    {"url": "http://pm-kisan-yojana-aadhaar-update.buzz/login"},
    {"url": "https://cybercrime.gov.in"},
    {"url": "https://sbi.co.in"},
    {"url": "https://cert-in.org.in"},
    {"url": "https://isro.gov.in"}
]

def seed_database(db: Session = None):
    should_close = False
    if db is None:
        Base.metadata.create_all(bind=engine)
        db = SessionLocal()
        should_close = True

    try:
        # Check if already seeded
        if db.query(Post).count() >= 50:
            print("[INFO] Database already populated with 50+ posts.")
            return

        print("[INFO] Seeding Tech Netra with 50+ Indian social media posts and threat intelligence...")

        # 1. Seed Posts with NLP & Geocoding Analysis
        all_post_records = SAMPLE_INDIAN_POSTS + EXTENDED_POSTS
        post_objects = []
        base_time = datetime.utcnow()

        for idx, item in enumerate(all_post_records):
            coords = ThreatAnalyzerService.get_coordinates_for_region(item["region"])
            analysis = ThreatAnalyzerService.analyze_text(item["text"])
            
            # Add small random delta to coords so markers don't overlap completely
            lat = coords[0] + random.uniform(-0.08, 0.08)
            lon = coords[1] + random.uniform(-0.08, 0.08)
            
            post_time = base_time - timedelta(minutes=random.randint(5, 1440))
            likes = random.randint(50, 4500) if not analysis["is_flagged"] else random.randint(2, 450)
            retweets = random.randint(10, 1200) if not analysis["is_flagged"] else random.randint(50, 2400) # Bots burst retweet

            post_obj = Post(
                platform=item["platform"],
                username=item["username"],
                text=item["text"],
                timestamp=post_time,
                region=item["region"],
                latitude=round(lat, 5),
                longitude=round(lon, 5),
                likes=likes,
                retweets=retweets,
                sentiment=analysis["sentiment"],
                sentiment_score=analysis["sentiment_score"],
                risk_level=analysis["risk_level"],
                is_flagged=analysis["is_flagged"],
                topic=item["topic"]
            )
            post_objects.append(post_obj)

        db.add_all(post_objects)
        db.commit()
        print(f"[SUCCESS] Seeded {len(post_objects)} social media posts across 15 Indian regions.")

        # 2. Seed Bot Profiles
        bot_objects = []
        for b in SAMPLE_BOTS:
            bot_data = ThreatAnalyzerService.analyze_bot_profile(
                username=b["username"],
                followers=b["followers"],
                following=b["following"],
                posts_per_hr=b["posts_per_hr"],
                account_age_days=b["account_age"]
            )
            bot_obj = BotProfile(
                username=bot_data["username"],
                platform=b["platform"],
                followers_count=bot_data["followers_count"],
                following_count=bot_data["following_count"],
                posts_frequency_per_hr=bot_data["posts_frequency_per_hr"],
                account_age_days=bot_data["account_age_days"],
                bot_probability=bot_data["bot_probability"],
                abnormal_patterns=bot_data["abnormal_patterns"],
                network_cluster=bot_data["network_cluster"],
                is_flagged=bot_data["is_flagged"]
            )
            bot_objects.append(bot_obj)

        db.add_all(bot_objects)
        db.commit()
        print(f"[SUCCESS] Seeded {len(bot_objects)} bot profiles and astroturfing clusters.")

        # 3. Seed Link Scans
        link_objects = []
        for l in SAMPLE_LINKS:
            scan_res = ThreatAnalyzerService.scan_url(l["url"])
            link_obj = LinkScan(
                url=scan_res["url"],
                domain=scan_res["domain"],
                threat_type=scan_res["threat_type"],
                confidence_score=scan_res["confidence_score"],
                risk_factors=scan_res["risk_factors"],
                redirect_count=scan_res["redirect_count"]
            )
            link_objects.append(link_obj)

        db.add_all(link_objects)
        db.commit()
        print(f"[SUCCESS] Seeded {len(link_objects)} scanned URL intelligence records.")

    finally:
        if should_close:
            db.close()

if __name__ == "__main__":
    seed_database()
