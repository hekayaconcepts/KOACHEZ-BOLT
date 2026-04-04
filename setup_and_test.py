import os
from supabase import create_client, Client

url = "https://tgwiinzsjowdysqdorjh.supabase.co"
key = "sb_publishable_Vnm3tRiW1J-Fy28eAx3MlA_eh7WEPbF"
# Note: For storage operations, a service role key is usually needed. 
# Since I only have the publishable key, I'll try to list buckets to see if it works.
# If not, I'll focus on the auth test which uses the publishable key.

supabase: Client = create_client(url, key)

def test_auth():
    print("--- Testing Auth ---")
    test_email = f"test_coach_{os.urandom(4).hex()}@gmail.com"
    test_password = "TestPassword123!"
    
    print(f"Attempting to register: {test_email}")
    try:
        res = supabase.auth.sign_up({
            "email": test_email,
            "password": test_password,
        })
        print(f"Sign up response: {res}")
        if res.user:
            print(f"Success: User created with ID {res.user.id}")
            
            print("Attempting to login...")
            login_res = supabase.auth.sign_in_with_password({
                "email": test_email,
                "password": test_password,
            })
            if login_res.session:
                print("Success: Session established")
                
                print("Attempting to logout...")
                supabase.auth.sign_out()
                print("Success: Logged out")
                return True
            else:
                print("Failed: No session returned")
        else:
            print("Failed: No user returned")
    except Exception as e:
        print(f"Error during auth test: {e}")
    return False

def check_storage():
    print("\n--- Checking Storage ---")
    try:
        buckets = supabase.storage.list_buckets()
        print(f"Existing buckets: {[b.name for b in buckets]}")
        
        required_buckets = [
            'profile_images', 'course_videos', 'podcast_audio', 
            'digital_products', 'contracts', 'session_recordings'
        ]
        
        for bucket_name in required_buckets:
            if any(b.name == bucket_name for b in buckets):
                print(f"Bucket '{bucket_name}' already exists.")
            else:
                print(f"Bucket '{bucket_name}' is missing. (Manual creation in Supabase Dashboard required if this fails)")
                # Publishable key cannot create buckets, but we can try
                try:
                    supabase.storage.create_bucket(bucket_name, options={'public': True})
                    print(f"Successfully created bucket: {bucket_name}")
                except Exception as e:
                    print(f"Could not create bucket '{bucket_name}': {e}")
    except Exception as e:
        print(f"Error checking storage: {e}")

if __name__ == "__main__":
    # First, try auth test as it's the highest priority
    auth_success = test_auth()
    
    # Then check storage
    check_storage()
    
    if auth_success:
        print("\nSprint 1 Auth Test: PASSED")
    else:
        print("\nSprint 1 Auth Test: FAILED")
