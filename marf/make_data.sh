head -n 1000000 ~/data/with_mmap.log | python3 speed_over_time.py with_mmap > with_mmap.csv
head -n 1000000 ~/data/no_mmap.log | python3 speed_over_time.py no_mmap > no_mmap.csv
