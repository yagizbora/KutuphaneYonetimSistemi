﻿namespace KutuphaneYonetimSistemi
{
    partial class Form4
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            DataGridViewCellStyle dataGridViewCellStyle1 = new DataGridViewCellStyle();
            DataGridViewCellStyle dataGridViewCellStyle2 = new DataGridViewCellStyle();
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(Form4));
            textBoxusername = new TextBox();
            label1 = new Label();
            textBoxpassword = new TextBox();
            label2 = new Label();
            button1 = new Button();
            groupBox1 = new GroupBox();
            dataGridView1 = new DataGridView();
            groupBox2 = new GroupBox();
            button4 = new Button();
            labeluserid = new Label();
            label5 = new Label();
            button3 = new Button();
            button2 = new Button();
            textBoxEditpassword = new TextBox();
            textBoxEditusername = new TextBox();
            label3 = new Label();
            label4 = new Label();
            groupBox3 = new GroupBox();
            button5 = new Button();
            textBoxfilterpassword = new TextBox();
            textBoxfilterusername = new TextBox();
            label6 = new Label();
            label7 = new Label();
            button6 = new Button();
            groupBox1.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)dataGridView1).BeginInit();
            groupBox2.SuspendLayout();
            groupBox3.SuspendLayout();
            SuspendLayout();
            // 
            // textBoxusername
            // 
            textBoxusername.Location = new Point(24, 49);
            textBoxusername.Name = "textBoxusername";
            textBoxusername.Size = new Size(117, 23);
            textBoxusername.TabIndex = 0;
            // 
            // label1
            // 
            label1.AutoSize = true;
            label1.ForeColor = Color.Black;
            label1.Location = new Point(24, 31);
            label1.Name = "label1";
            label1.Size = new Size(71, 15);
            label1.TabIndex = 1;
            label1.Text = "Kullanıcı adı";
            // 
            // textBoxpassword
            // 
            textBoxpassword.Location = new Point(24, 110);
            textBoxpassword.Name = "textBoxpassword";
            textBoxpassword.Size = new Size(117, 23);
            textBoxpassword.TabIndex = 2;
            // 
            // label2
            // 
            label2.AutoSize = true;
            label2.ForeColor = Color.Black;
            label2.Location = new Point(24, 92);
            label2.Name = "label2";
            label2.Size = new Size(30, 15);
            label2.TabIndex = 3;
            label2.Text = "Şifre";
            // 
            // button1
            // 
            button1.ForeColor = Color.Black;
            button1.Location = new Point(24, 149);
            button1.Name = "button1";
            button1.Size = new Size(117, 35);
            button1.TabIndex = 4;
            button1.Text = "Kullanıcıyı Oluştur";
            button1.UseVisualStyleBackColor = true;
            button1.Click += button1_Click;
            // 
            // groupBox1
            // 
            groupBox1.Controls.Add(textBoxpassword);
            groupBox1.Controls.Add(button1);
            groupBox1.Controls.Add(textBoxusername);
            groupBox1.Controls.Add(label2);
            groupBox1.Controls.Add(label1);
            groupBox1.Location = new Point(12, 12);
            groupBox1.Name = "groupBox1";
            groupBox1.Size = new Size(158, 206);
            groupBox1.TabIndex = 5;
            groupBox1.TabStop = false;
            groupBox1.Text = "Kullanıcı Oluşturma";
            // 
            // dataGridView1
            // 
            dataGridView1.BackgroundColor = SystemColors.ControlLight;
            dataGridView1.ColumnHeadersHeightSizeMode = DataGridViewColumnHeadersHeightSizeMode.AutoSize;
            dataGridView1.GridColor = SystemColors.WindowText;
            dataGridView1.Location = new Point(12, 224);
            dataGridView1.Name = "dataGridView1";
            dataGridViewCellStyle1.Alignment = DataGridViewContentAlignment.MiddleLeft;
            dataGridViewCellStyle1.BackColor = SystemColors.WindowFrame;
            dataGridViewCellStyle1.Font = new Font("Segoe UI", 9F);
            dataGridViewCellStyle1.ForeColor = SystemColors.WindowText;
            dataGridViewCellStyle1.SelectionBackColor = SystemColors.Highlight;
            dataGridViewCellStyle1.SelectionForeColor = SystemColors.HighlightText;
            dataGridViewCellStyle1.WrapMode = DataGridViewTriState.True;
            dataGridView1.RowHeadersDefaultCellStyle = dataGridViewCellStyle1;
            dataGridViewCellStyle2.BackColor = Color.White;
            dataGridViewCellStyle2.ForeColor = Color.Black;
            dataGridViewCellStyle2.SelectionBackColor = Color.Blue;
            dataGridViewCellStyle2.SelectionForeColor = Color.White;
            dataGridView1.RowsDefaultCellStyle = dataGridViewCellStyle2;
            dataGridView1.Size = new Size(697, 247);
            dataGridView1.TabIndex = 6;
            dataGridView1.CellClick += dataGridView1_CellClick;
            // 
            // groupBox2
            // 
            groupBox2.Controls.Add(button4);
            groupBox2.Controls.Add(labeluserid);
            groupBox2.Controls.Add(label5);
            groupBox2.Controls.Add(button3);
            groupBox2.Controls.Add(button2);
            groupBox2.Controls.Add(textBoxEditpassword);
            groupBox2.Controls.Add(textBoxEditusername);
            groupBox2.Controls.Add(label3);
            groupBox2.Controls.Add(label4);
            groupBox2.Location = new Point(176, 19);
            groupBox2.Name = "groupBox2";
            groupBox2.Size = new Size(326, 199);
            groupBox2.TabIndex = 7;
            groupBox2.TabStop = false;
            groupBox2.Text = "Kullanıcı düzenleme";
            // 
            // button4
            // 
            button4.ForeColor = Color.Black;
            button4.Location = new Point(236, 142);
            button4.Name = "button4";
            button4.Size = new Size(74, 35);
            button4.TabIndex = 12;
            button4.Text = "Temizle";
            button4.UseVisualStyleBackColor = true;
            button4.Click += button4_Click;
            // 
            // labeluserid
            // 
            labeluserid.AutoSize = true;
            labeluserid.ForeColor = Color.Black;
            labeluserid.Location = new Point(218, 24);
            labeluserid.Name = "labeluserid";
            labeluserid.Size = new Size(12, 15);
            labeluserid.TabIndex = 11;
            labeluserid.Text = "-";
            // 
            // label5
            // 
            label5.AutoSize = true;
            label5.ForeColor = Color.Black;
            label5.Location = new Point(153, 24);
            label5.Name = "label5";
            label5.Size = new Size(69, 15);
            label5.TabIndex = 10;
            label5.Text = "Kullanıcı ID:";
            // 
            // button3
            // 
            button3.ForeColor = Color.Black;
            button3.Location = new Point(129, 142);
            button3.Name = "button3";
            button3.Size = new Size(101, 35);
            button3.TabIndex = 9;
            button3.Text = "Kullanıcıyı Sil";
            button3.UseVisualStyleBackColor = true;
            button3.Click += button3_Click;
            // 
            // button2
            // 
            button2.ForeColor = Color.Black;
            button2.Location = new Point(6, 142);
            button2.Name = "button2";
            button2.Size = new Size(117, 35);
            button2.TabIndex = 8;
            button2.Text = "Kullanıcıyı Düzenle";
            button2.UseVisualStyleBackColor = true;
            button2.Click += button2_Click;
            // 
            // textBoxEditpassword
            // 
            textBoxEditpassword.Location = new Point(6, 103);
            textBoxEditpassword.Name = "textBoxEditpassword";
            textBoxEditpassword.Size = new Size(117, 23);
            textBoxEditpassword.TabIndex = 6;
            // 
            // textBoxEditusername
            // 
            textBoxEditusername.Location = new Point(6, 42);
            textBoxEditusername.Name = "textBoxEditusername";
            textBoxEditusername.Size = new Size(117, 23);
            textBoxEditusername.TabIndex = 4;
            // 
            // label3
            // 
            label3.AutoSize = true;
            label3.ForeColor = Color.Black;
            label3.Location = new Point(6, 85);
            label3.Name = "label3";
            label3.Size = new Size(30, 15);
            label3.TabIndex = 7;
            label3.Text = "Şifre";
            // 
            // label4
            // 
            label4.AutoSize = true;
            label4.ForeColor = Color.Black;
            label4.Location = new Point(6, 24);
            label4.Name = "label4";
            label4.Size = new Size(71, 15);
            label4.TabIndex = 5;
            label4.Text = "Kullanıcı adı";
            // 
            // groupBox3
            // 
            groupBox3.Controls.Add(button6);
            groupBox3.Controls.Add(button5);
            groupBox3.Controls.Add(textBoxfilterpassword);
            groupBox3.Controls.Add(textBoxfilterusername);
            groupBox3.Controls.Add(label6);
            groupBox3.Controls.Add(label7);
            groupBox3.Location = new Point(508, 19);
            groupBox3.Name = "groupBox3";
            groupBox3.Size = new Size(201, 199);
            groupBox3.TabIndex = 8;
            groupBox3.TabStop = false;
            groupBox3.Text = "Filtreleme";
            // 
            // button5
            // 
            button5.ForeColor = Color.Black;
            button5.Location = new Point(3, 142);
            button5.Name = "button5";
            button5.Size = new Size(74, 35);
            button5.TabIndex = 13;
            button5.Text = "Filtrele";
            button5.UseVisualStyleBackColor = true;
            button5.Click += button5_Click;
            // 
            // textBoxfilterpassword
            // 
            textBoxfilterpassword.Location = new Point(6, 103);
            textBoxfilterpassword.Name = "textBoxfilterpassword";
            textBoxfilterpassword.Size = new Size(117, 23);
            textBoxfilterpassword.TabIndex = 10;
            // 
            // textBoxfilterusername
            // 
            textBoxfilterusername.Location = new Point(6, 42);
            textBoxfilterusername.Name = "textBoxfilterusername";
            textBoxfilterusername.Size = new Size(117, 23);
            textBoxfilterusername.TabIndex = 8;
            // 
            // label6
            // 
            label6.AutoSize = true;
            label6.ForeColor = Color.Black;
            label6.Location = new Point(6, 85);
            label6.Name = "label6";
            label6.Size = new Size(30, 15);
            label6.TabIndex = 11;
            label6.Text = "Şifre";
            // 
            // label7
            // 
            label7.AutoSize = true;
            label7.ForeColor = Color.Black;
            label7.Location = new Point(6, 24);
            label7.Name = "label7";
            label7.Size = new Size(71, 15);
            label7.TabIndex = 9;
            label7.Text = "Kullanıcı adı";
            // 
            // button6
            // 
            button6.ForeColor = Color.Black;
            button6.Location = new Point(86, 142);
            button6.Name = "button6";
            button6.Size = new Size(108, 35);
            button6.TabIndex = 14;
            button6.Text = "Filtre temizle";
            button6.UseVisualStyleBackColor = true;
            button6.Click += button6_Click;
            // 
            // Form4
            // 
            AutoScaleDimensions = new SizeF(7F, 15F);
            AutoScaleMode = AutoScaleMode.Font;
            BackColor = Color.FromArgb(255, 224, 192);
            ClientSize = new Size(716, 477);
            Controls.Add(groupBox3);
            Controls.Add(groupBox2);
            Controls.Add(dataGridView1);
            Controls.Add(groupBox1);
            ForeColor = Color.White;
            Icon = (Icon)resources.GetObject("$this.Icon");
            MaximizeBox = false;
            Name = "Form4";
            Text = "Kullanıcı Oluştur";
            Load += Form4_Load;
            groupBox1.ResumeLayout(false);
            groupBox1.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)dataGridView1).EndInit();
            groupBox2.ResumeLayout(false);
            groupBox2.PerformLayout();
            groupBox3.ResumeLayout(false);
            groupBox3.PerformLayout();
            ResumeLayout(false);
        }

        #endregion

        private TextBox textBoxusername;
        private Label label1;
        private TextBox textBoxpassword;
        private Label label2;
        private Button button1;
        private GroupBox groupBox1;
        private DataGridView dataGridView1;
        private GroupBox groupBox2;
        private Button button2;
        private TextBox textBoxEditpassword;
        private TextBox textBoxEditusername;
        private Label label3;
        private Label label4;
        private Button button3;
        private Label labeluserid;
        private Label label5;
        private Button button4;
        private GroupBox groupBox3;
        private Button button5;
        private TextBox textBoxfilterpassword;
        private TextBox textBoxfilterusername;
        private Label label6;
        private Label label7;
        private Button button6;
    }
}