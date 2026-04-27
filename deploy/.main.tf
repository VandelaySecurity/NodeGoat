resource "aws_security_group" "bad" {
  name = "bad-sg"
  ingress {
   from_port  = 22
   to_port   = 22
   protocol  = "tcp"
   cidr_blocks = ["0.0.0.0/0"]
  }
  egress {
   from_port  = 0
   to_port   = 0
   protocol  = "-1"
   cidr_blocks = ["0.0.0.0/0"]
  }
 }

 resource "aws_s3_bucket" "bad" {
  bucket = "my-test-bucket"
  acl  = "public-read"
 }

 resource "aws_db_instance" "bad" {
  engine       = "mysql"
  instance_class   = "db.t3.micro"
  allocated_storage  = 10
  username      = "admin"
  password      = "password123"
  storage_encrypted  = false
  publicly_accessible = true
  skip_final_snapshot = true
 }