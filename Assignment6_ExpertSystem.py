# Assignment 6: Expert System - Medical Diagnosis
# Implement any one Expert System
# Choice: Hospitals and Medical Facilities (Medical Diagnosis)

def medical_expert_system():
    print("=" * 55)
    print("  Medical Diagnosis Expert System")
    print("=" * 55)
    print("Answer the following questions (yes/no):\n")
    
    symptoms = {}
    questions = {
        "fever": "Do you have fever? ",
        "cough": "Do you have cough? ",
        "cold": "Do you have cold/runny nose? ",
        "headache": "Do you have headache? ",
        "body_pain": "Do you have body pain? ",
        "sore_throat": "Do you have sore throat? ",
        "breathing": "Do you have difficulty breathing? ",
        "fatigue": "Do you feel fatigued/tired? ",
        "vomiting": "Do you have vomiting/nausea? ",
        "diarrhea": "Do you have diarrhea? ",
        "rash": "Do you have skin rash? ",
        "sneezing": "Do you have sneezing? ",
    }
    
    for key, question in questions.items():
        ans = input(question).strip().lower()
        symptoms[key] = ans in ['yes', 'y']
    
    print("\n" + "=" * 55)
    print("  DIAGNOSIS RESULTS")
    print("=" * 55)
    
    diagnosed = False
    
    # Rule-based diagnosis
    if symptoms["fever"] and symptoms["cough"] and symptoms["breathing"]:
        print("\n>> Possible Condition: COVID-19 / Pneumonia")
        print("   Advice: Get tested immediately. Isolate yourself.")
        print("   Consult a pulmonologist.")
        diagnosed = True
    
    if symptoms["fever"] and symptoms["body_pain"] and symptoms["headache"]:
        print("\n>> Possible Condition: Dengue / Viral Fever")
        print("   Advice: Get a blood test (CBC, Platelet count).")
        print("   Stay hydrated and rest.")
        diagnosed = True
    
    if symptoms["cold"] and symptoms["sneezing"] and symptoms["sore_throat"]:
        print("\n>> Possible Condition: Common Cold / Allergic Rhinitis")
        print("   Advice: Take antihistamines. Stay warm.")
        print("   If persists > 7 days, consult a doctor.")
        diagnosed = True
    
    if symptoms["fever"] and symptoms["cough"] and symptoms["sore_throat"] and symptoms["cold"]:
        print("\n>> Possible Condition: Influenza (Flu)")
        print("   Advice: Rest, drink fluids, take paracetamol.")
        print("   Consult doctor if symptoms worsen.")
        diagnosed = True
    
    if symptoms["vomiting"] and symptoms["diarrhea"]:
        print("\n>> Possible Condition: Food Poisoning / Gastroenteritis")
        print("   Advice: Stay hydrated with ORS. Eat light food.")
        print("   Visit a doctor if symptoms persist > 24 hours.")
        diagnosed = True
    
    if symptoms["headache"] and symptoms["fatigue"] and not symptoms["fever"]:
        print("\n>> Possible Condition: Migraine / Stress")
        print("   Advice: Take rest in a dark quiet room.")
        print("   Manage stress. Consult if recurring.")
        diagnosed = True
    
    if symptoms["rash"] and symptoms["fever"]:
        print("\n>> Possible Condition: Measles / Chickenpox")
        print("   Advice: Consult a dermatologist immediately.")
        print("   Avoid scratching. Stay isolated.")
        diagnosed = True
    
    if symptoms["cough"] and symptoms["sore_throat"] and not symptoms["fever"]:
        print("\n>> Possible Condition: Throat Infection / Pharyngitis")
        print("   Advice: Gargle with warm salt water.")
        print("   Take lozenges. Visit doctor if persists.")
        diagnosed = True
    
    if not diagnosed:
        print("\n>> No specific condition matched your symptoms.")
        print("   Advice: Please consult a general physician for proper diagnosis.")
    
    print("\n" + "=" * 55)
    print("  DISCLAIMER: This is a basic expert system.")
    print("  Always consult a qualified doctor for proper diagnosis.")
    print("=" * 55)

# --- Main ---
if __name__ == "__main__":
    medical_expert_system()

# Sample Run:
# fever: yes, cough: yes, cold: no, headache: yes,
# body_pain: yes, sore_throat: no, breathing: no,
# fatigue: yes, vomiting: no, diarrhea: no, rash: no, sneezing: no
# -> Diagnosis: Dengue / Viral Fever
